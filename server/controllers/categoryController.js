const Category = require('../models/Category');

const getFullUrl = (path, req) => {
    if (!path) return path;
    if (path.startsWith('http')) return path;
    return `${req.protocol}://${req.get('host')}${path}`;
};

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
const getCategories = async (req, res) => {
    try {
        const query = req.query.all === 'true' ? {} : { isActive: true };
        const categories = await Category.find(query)
            .populate('parent')
            .sort({ displayOrder: 1, name: 1 });

        if (!categories) {
            return res.status(200).json([]);
        }

        const categoriesWithUrls = categories.map(c => {
            const category = c.toObject();
            category.image = getFullUrl(category.image, req);
            return category;
        });
        res.status(200).json(categoriesWithUrls);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: "Failed to fetch categories" });
    }
};

// @desc    Create category
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res) => {
    try {
        const categoryData = { ...req.body };

        // Clean up image path if it's a full URL
        if (categoryData.image && categoryData.image.includes('/uploads/')) {
            categoryData.image = '/uploads/' + categoryData.image.split('/uploads/')[1];
        }

        const category = await Category.create(categoryData);
        res.status(201).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private
const updateCategory = async (req, res) => {
    try {
        const updateData = { ...req.body };

        // Clean up image path if it's a full URL
        if (updateData.image && updateData.image.includes('/uploads/')) {
            updateData.image = '/uploads/' + updateData.image.split('/uploads/')[1];
        }

        const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.status(200).json(category);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private
const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }
        await category.deleteOne();
        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
};
