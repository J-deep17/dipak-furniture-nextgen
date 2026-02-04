const ServiceableArea = require('../models/ServiceableArea');

// @desc    Check pincode availability
// @route   GET /api/delivery/check/:pincode
// @access  Public
const checkPincode = async (req, res) => {
    try {
        const { pincode } = req.params;

        if (!/^\d{6}$/.test(pincode)) {
            return res.status(400).json({ message: 'Invalid pincode format' });
        }

        // 1. Check local database
        const area = await ServiceableArea.findOne({ pincode, isActive: true });

        if (area) {
            return res.json({
                available: true,
                city: area.city,
                state: area.state,
                source: 'db'
            });
        }

        // 2. Fallback Logic
        // Gujarat pincodes start with 36, 37, 38, 39
        const prefix = pincode.substring(0, 2);
        const gujaratPrefixes = ['36', '37', '38', '39'];

        if (gujaratPrefixes.includes(prefix)) {
            return res.json({
                available: true,
                city: "Gujarat Area", // Generic since we don't know the exact city
                state: "Gujarat",
                source: 'fallback'
            });
        }

        // Major cities prefixes (approximate)
        // Mumbai: 400-404
        // Pune: 411-412
        // Delhi: 110
        // Bengaluru: 560
        // Chennai: 600
        // Hyderabad: 500
        // Kolkata: 700

        const cityMap = {
            '40': { city: 'Mumbai/Thane', state: 'Maharashtra' },
            '411': { city: 'Pune', state: 'Maharashtra' },
            '11': { city: 'Delhi', state: 'Delhi' },
            '56': { city: 'Bengaluru', state: 'Karnataka' },
            '60': { city: 'Chennai', state: 'Tamil Nadu' },
            '50': { city: 'Hyderabad', state: 'Telangana' },
            '70': { city: 'Kolkata', state: 'West Bengal' },
            '30': { city: 'Jaipur', state: 'Rajasthan' },
            '45': { city: 'Indore', state: 'Madhya Pradesh' },
            '46': { city: 'Bhopal', state: 'Madhya Pradesh' }
        };

        const prefix3 = pincode.substring(0, 3);
        const prefix2 = pincode.substring(0, 2);

        if (cityMap[prefix3]) {
            return res.json({
                available: true,
                city: cityMap[prefix3].city,
                state: cityMap[prefix3].state,
                source: 'fallback'
            });
        }

        if (cityMap[prefix2]) {
            return res.json({
                available: true,
                city: cityMap[prefix2].city,
                state: cityMap[prefix2].state,
                source: 'fallback'
            });
        }

        return res.json({ available: false });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Admin methods
const getAllAreas = async (req, res) => {
    try {
        const areas = await ServiceableArea.find().sort({ pincode: 1 });
        res.json(areas);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const addArea = async (req, res) => {
    try {
        const { pincode, city, state } = req.body;
        const area = await ServiceableArea.create({ pincode, city, state });
        res.status(201).json(area);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const updateArea = async (req, res) => {
    try {
        const area = await ServiceableArea.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(area);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const deleteArea = async (req, res) => {
    try {
        await ServiceableArea.findByIdAndDelete(req.params.id);
        res.json({ message: 'Area removed' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

const bulkUpload = async (req, res) => {
    try {
        // Simple implementation for now, assuming array of objects in body
        const areas = req.body; // [{pincode, city, state}]
        await ServiceableArea.insertMany(areas, { ordered: false });
        res.json({ message: 'Bulk upload successful' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

module.exports = {
    checkPincode,
    getAllAreas,
    addArea,
    updateArea,
    deleteArea,
    bulkUpload
};
