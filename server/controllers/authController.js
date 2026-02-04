const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');

// @desc    Register new user/customer
// @route   POST /api/auth/signup
// @access  Public
const signup = async (req, res) => {
    try {
        const { name, email, phoneNumber, password } = req.body;

        // Check if email already exists
        const emailExists = await User.findOne({ email });
        if (emailExists) return res.status(400).json({ message: 'Email already registered' });

        // Check if phone already exists
        if (phoneNumber) {
            const phoneExists = await User.findOne({ phoneNumber });
            if (phoneExists) return res.status(400).json({ message: 'Phone number already registered' });
        }

        // Generate email verification token
        const verificationToken = crypto.randomBytes(20).toString('hex');
        const verificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

        const user = await User.create({
            name,
            email,
            phoneNumber,
            password,
            emailVerificationToken: verificationToken,
            emailVerificationExpire: verificationExpire,
            role: 'customer'
        });

        // Send Verification Email
        const verifyUrl = `${req.get('origin')}/verify-email?token=${verificationToken}`;
        const message = `Welcome to SteelShow Digital! Please verify your email by clicking: ${verifyUrl}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
                <h2 style="color: #333;">Welcome to SteelShow Digital</h2>
                <p>Hi ${name},</p>
                <p>Thank you for signing up. Please verify your email address to get started.</p>
                <a href="${verifyUrl}" style="display: inline-block; padding: 12px 24px; background-color: #f2a900; color: #fff; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">Verify Email Address</a>
                <p style="font-size: 12px; color: #666;">If you didn't create this account, you can safely ignore this email.</p>
            </div>
        `;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Verify your SteelShow account',
                message,
                html
            });

            res.status(201).json({
                success: true,
                message: 'User registered. Please check your email for verification.'
            });
        } catch (err) {
            console.error('Email send error:', err);
            res.status(201).json({
                success: true,
                message: 'User registered, but verification email could not be sent. Please contact support.'
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Login with email/password
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email }).select('+password');

        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        if (!user.isEmailVerified) {
            return res.status(403).json({ message: 'Please verify your email first', unverified: 'email' });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Send Phone OTP
// @route   POST /api/auth/send-otp
// @access  Public
const sendOTP = async (req, res) => {
    try {
        const { phoneNumber } = req.body;

        // Find or Create user for Phone Login?
        // Let's assume user must exist for login, or we create a shallow user.
        let user = await User.findOne({ phoneNumber });

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6 digits
        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');
        const otpExpire = Date.now() + 5 * 60 * 1000; // 5 mins

        if (!user) {
            // Option to register via Phone OTP:
            // return res.status(404).json({ message: 'Phone number not found. Please sign up.' });
            // For now, let's allow it to facilitate "Login with Phone" as a signup/login hybrid if preferred
            // but the prompt says Sign up has Phone Number field.
            return res.status(404).json({ message: 'Phone number not registered' });
        }

        user.phoneOTP = hashedOTP;
        user.phoneOTPExpire = otpExpire;
        await user.save();

        // Send SMS
        await sendSMS(phoneNumber, `Your SteelShow Verification OTP is: ${otp}. Expires in 5 mins.`);

        res.json({ success: true, message: 'OTP sent to your phone' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify Phone OTP & Login/Verify
// @route   POST /api/auth/verify-otp
// @access  Public
const verifyOTP = async (req, res) => {
    try {
        const { phoneNumber, otp } = req.body;
        const hashedOTP = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            phoneNumber,
            phoneOTP: hashedOTP,
            phoneOTPExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        user.phoneOTP = undefined;
        user.phoneOTPExpire = undefined;
        user.isPhoneVerified = true;
        await user.save();

        const token = generateToken(user._id);

        res.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Google Login
// @route   POST /api/auth/google
// @access  Public
const googleLogin = async (req, res) => {
    try {
        const { googleId, email, name, avatar } = req.body;

        let user = await User.findOne({ $or: [{ googleId }, { email }] });

        if (user) {
            if (!user.googleId) user.googleId = googleId;
            if (!user.avatar) user.avatar = avatar;
            user.isEmailVerified = true;
            await user.save();
        } else {
            user = await User.create({
                name,
                email,
                googleId,
                avatar,
                isEmailVerified: true,
                role: 'customer',
                password: crypto.randomBytes(16).toString('hex') // Generate random password
            });
        }

        const token = generateToken(user._id);

        res.json({
            success: true,
            user: { id: user._id, name: user.name, email: user.email, role: user.role },
            token
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        const user = await User.findOne({
            emailVerificationToken: token,
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired verification link' });
        }

        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();

        res.json({ success: true, message: 'Email verified successfully. You can now login.' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: 'User not found with that email' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

        await user.save();

        const resetUrl = `${req.get('origin')}/reset-password/${resetToken}`;
        const message = `You requested a password reset. Reset here: ${resetUrl}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                <h2>Password Reset Request</h2>
                <p>We received a request to reset your password. Click the button below:</p>
                <a href="${resetUrl}" style="background-color: #000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
                <p>This link expires in 10 minutes.</p>
            </div>
        `;

        await sendEmail({
            email: user.email,
            subject: 'Password reset token',
            message,
            html
        });

        res.json({ success: true, message: 'Email sent' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash('sha256').update(req.params.resetToken).digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired reset token' });
        }

        user.password = req.body.password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.json({ success: true, message: 'Password reset successful' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Generate JWT
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'secret', {
        expiresIn: '30d'
    });
};

module.exports = {
    signup,
    login,
    sendOTP,
    verifyOTP,
    googleLogin,
    verifyEmail,
    forgotPassword,
    resetPassword
};
