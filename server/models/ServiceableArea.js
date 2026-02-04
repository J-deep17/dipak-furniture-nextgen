const mongoose = require('mongoose');

const serviceableAreaSchema = new mongoose.Schema({
    pincode: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ServiceableArea', serviceableAreaSchema);
