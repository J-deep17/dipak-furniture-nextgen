const express = require('express');
const router = express.Router();
const {
    getHeroBanners,
    getAllHeroBanners,
    createHeroBanner,
    updateHeroBanner,
    deleteHeroBanner
} = require('../controllers/heroBannerController');
const { protect, admin } = require('../middleware/authMiddleware');

router.get('/', getHeroBanners);
router.get('/admin', protect, admin, getAllHeroBanners);
router.post('/', protect, admin, createHeroBanner);
router.put('/:id', protect, admin, updateHeroBanner);
router.delete('/:id', protect, admin, deleteHeroBanner);

module.exports = router;
