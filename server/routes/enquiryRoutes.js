const express = require('express');
const router = express.Router();
const {
    getEnquiries,
    createEnquiry,
    updateEnquiryStatus
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(protect, getEnquiries)
    .post(createEnquiry); // Public

router.route('/:id')
    .put(protect, updateEnquiryStatus);

module.exports = router;
