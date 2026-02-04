const express = require('express');
const router = express.Router();
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/categoryController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getCategories)
    .post(protect, authorize('superadmin', 'editor'), createCategory);

router.route('/:id')
    .put(protect, authorize('superadmin', 'editor'), updateCategory)
    .delete(protect, authorize('superadmin', 'editor'), deleteCategory);

module.exports = router;
