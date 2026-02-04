const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const { generateProductFromImage, regenerateProductField } = require('../controllers/aiController');
const { protect, authorize } = require('../middleware/authMiddleware');

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename(req, file, cb) {
        cb(
            null,
            `ai-${Date.now()}${path.extname(file.originalname)}`
        );
    }
});

function checkFileType(file, cb) {
    const filetypes = /jpg|jpeg|png|webp/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb('Images only!');
    }
}

const upload = multer({
    storage,
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Routes
router.post('/generate', protect, upload.single('image'), generateProductFromImage);
router.post('/regenerate', protect, upload.single('image'), regenerateProductField);

// Test Route
router.get("/test", (req, res) => {
    res.send("AI Controller Ready");
});

module.exports = router;
