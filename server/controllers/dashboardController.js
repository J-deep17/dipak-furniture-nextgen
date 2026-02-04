const Product = require('../models/Product');
const Category = require('../models/Category');
const Enquiry = require('../models/Enquiry');
const User = require('../models/User');

// @desc    Get dashboard stats
// @route   GET /api/dashboard/stats
// @access  Private
const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCategories = await Category.countDocuments();
        const totalEnquiries = await Enquiry.countDocuments();
        const totalUsers = await User.countDocuments();

        const lowStockCount = await Product.countDocuments({
            stockStatus: { $in: ['Low Stock', 'Out of Stock'] }
        });

        const recentEnquiries = await Enquiry.find().sort({ createdAt: -1 }).limit(5);

        res.status(200).json({
            stats: {
                products: totalProducts,
                categories: totalCategories,
                enquiries: totalEnquiries,
                users: totalUsers,
                lowStock: lowStockCount
            },
            recentActivity: recentEnquiries
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getDashboardStats
};
