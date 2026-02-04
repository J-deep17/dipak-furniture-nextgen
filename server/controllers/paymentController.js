// RAZORPAY TEMPORARILY DISABLED - Uncomment when credentials are configured
// const Razorpay = require('razorpay');
// const crypto = require('crypto');
const Order = require('../models/Order');

// RAZORPAY TEMPORARILY DISABLED - Uncomment when credentials are configured
// Initialize Razorpay
// const razorpay = new Razorpay({
//     key_id: process.env.RAZORPAY_KEY_ID,
//     key_secret: process.env.RAZORPAY_KEY_SECRET
// });

// @desc    Create Razorpay order (TEMPORARILY DISABLED)
// @route   POST /api/payment/create-order
// @access  Public
const createRazorpayOrder = async (req, res) => {
    return res.status(503).json({
        success: false,
        message: 'Online payment is temporarily disabled. Please use Cash on Delivery.'
    });
};

// @desc    Verify Razorpay payment (TEMPORARILY DISABLED)
// @route   POST /api/payment/verify
// @access  Public
const verifyPayment = async (req, res) => {
    return res.status(503).json({
        success: false,
        message: 'Online payment is temporarily disabled. Please use Cash on Delivery.'
    });
};

// @desc    Get payment details (TEMPORARILY DISABLED)
// @route   GET /api/payment/:paymentId
// @access  Private/Admin
const getPaymentDetails = async (req, res) => {
    return res.status(503).json({
        success: false,
        message: 'Online payment is temporarily disabled. Please use Cash on Delivery.'
    });
};

module.exports = {
    createRazorpayOrder,
    verifyPayment,
    getPaymentDetails
};
