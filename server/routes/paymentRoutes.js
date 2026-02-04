const express = require('express');
const router = express.Router();
const {
    createRazorpayOrder,
    verifyPayment,
    getPaymentDetails
} = require('../controllers/paymentController');
const { protect, admin } = require('../middleware/authMiddleware');

router.post('/create-order', createRazorpayOrder);
router.post('/verify', verifyPayment);
router.get('/:paymentId', protect, admin, getPaymentDetails);

module.exports = router;
