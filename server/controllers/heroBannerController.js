const HeroBanner = require('../models/HeroBanner');
const { getFullUrl } = require('../utils/urlHelper');

// @desc    Get all active hero banners
// @route   GET /api/hero-banners
// @access  Public
const getHeroBanners = async (req, res) => {
    try {
        const banners = await HeroBanner.find({ isActive: true })
            .sort({ order: 1 })
            .select('-__v');

        const bannersWithUrls = banners.map(banner => ({
            ...banner.toObject(),
            image: getFullUrl(banner.image, req)
        }));

        res.json(bannersWithUrls);
    } catch (error) {
        console.error('Get hero banners error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get all hero banners (admin)
// @route   GET /api/hero-banners/admin
// @access  Private/Admin
const getAllHeroBanners = async (req, res) => {
    try {
        const banners = await HeroBanner.find()
            .sort({ order: 1 })
            .select('-__v');

        const bannersWithUrls = banners.map(banner => ({
            ...banner.toObject(),
            image: getFullUrl(banner.image, req)
        }));

        res.json(bannersWithUrls);
    } catch (error) {
        console.error('Get all hero banners error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Create hero banner
// @route   POST /api/hero-banners
// @access  Private/Admin
const createHeroBanner = async (req, res) => {
    try {
        const banner = new HeroBanner(req.body);
        await banner.save();

        res.status(201).json({
            success: true,
            message: 'Hero banner created successfully',
            banner: {
                ...banner.toObject(),
                image: getFullUrl(banner.image, req)
            }
        });
    } catch (error) {
        console.error('Create hero banner error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update hero banner
// @route   PUT /api/hero-banners/:id
// @access  Private/Admin
const updateHeroBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const banner = await HeroBanner.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!banner) {
            return res.status(404).json({ message: 'Hero banner not found' });
        }

        res.json({
            success: true,
            message: 'Hero banner updated successfully',
            banner: {
                ...banner.toObject(),
                image: getFullUrl(banner.image, req)
            }
        });
    } catch (error) {
        console.error('Update hero banner error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete hero banner
// @route   DELETE /api/hero-banners/:id
// @access  Private/Admin
const deleteHeroBanner = async (req, res) => {
    try {
        const { id } = req.params;

        const banner = await HeroBanner.findByIdAndDelete(id);

        if (!banner) {
            return res.status(404).json({ message: 'Hero banner not found' });
        }

        res.json({
            success: true,
            message: 'Hero banner deleted successfully'
        });
    } catch (error) {
        console.error('Delete hero banner error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    getHeroBanners,
    getAllHeroBanners,
    createHeroBanner,
    updateHeroBanner,
    deleteHeroBanner
};
