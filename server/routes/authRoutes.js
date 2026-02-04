const express = require('express');
const router = express.Router();
const {
    signup,
    login,
    sendOTP,
    verifyOTP,
    googleLogin,
    verifyEmail,
    forgotPassword,
    resetPassword
} = require('../controllers/authController');

router.post('/signup', signup);
router.post('/login', login);
router.post('/send-otp', sendOTP);
router.post('/verify-otp', verifyOTP);
router.post('/google', googleLogin);
router.get('/verify-email/:token', verifyEmail);
router.post('/forgot-password', forgotPassword);
router.put('/reset-password/:resetToken', resetPassword);

module.exports = router;
