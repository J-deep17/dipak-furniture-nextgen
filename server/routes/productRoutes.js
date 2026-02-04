const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // Import upload middleware

const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    searchProducts,
    createProductReview,
    approveReview,
    deleteReview,
    updateProductStock
} = require('../controllers/productController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/search', searchProducts);

router.route('/')
    .get(getProducts)
    .post(protect, authorize('superadmin', 'editor'), upload.any(), createProduct);

router.route('/:id')
    .get(getProduct)
    .put(protect, authorize('superadmin', 'editor'), upload.any(), updateProduct)
    .delete(protect, authorize('superadmin', 'editor'), deleteProduct);

router.patch('/:id/stock', protect, authorize('superadmin', 'editor'), updateProductStock);

router.route('/:id/reviews').post(protect, createProductReview);
router.route('/:id/reviews/:reviewId/approve').put(protect, authorize('superadmin', 'editor'), approveReview);
router.route('/:id/reviews/:reviewId').delete(protect, authorize('superadmin', 'editor'), deleteReview);

module.exports = router;
