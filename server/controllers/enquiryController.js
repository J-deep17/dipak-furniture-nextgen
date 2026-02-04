const Enquiry = require('../models/Enquiry');

// @desc    Get all enquiries
// @route   GET /api/enquiries
// @access  Private (Admin only)
const getEnquiries = async (req, res) => {
    try {
        const enquiries = await Enquiry.find().sort({ createdAt: -1 });
        res.status(200).json(enquiries || []);
    } catch (error) {
        console.error('Error fetching enquiries:', error);
        res.status(500).json({ message: "Failed to fetch enquiries" });
    }
};

// @desc    Create enquiry
// @route   POST /api/enquiries
// @access  Public
const createEnquiry = async (req, res) => {
    try {
        const enquiry = await Enquiry.create(req.body);
        res.status(201).json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id
// @access  Private
const updateEnquiryStatus = async (req, res) => {
    try {
        const enquiry = await Enquiry.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!enquiry) {
            return res.status(404).json({ message: 'Enquiry not found' });
        }
        res.status(200).json(enquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    getEnquiries,
    createEnquiry,
    updateEnquiryStatus
};
