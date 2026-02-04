const express = require('express');
const router = express.Router();
const {
    checkPincode,
    getAllAreas,
    addArea,
    updateArea,
    deleteArea,
    bulkUpload
} = require('../controllers/deliveryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route
router.get('/check/:pincode', checkPincode);

// Admin routes
router.get('/', protect, admin, getAllAreas);
router.post('/', protect, admin, addArea);
router.put('/:id', protect, admin, updateArea);
router.delete('/:id', protect, admin, deleteArea);
router.post('/bulk', protect, admin, bulkUpload);

module.exports = router;
