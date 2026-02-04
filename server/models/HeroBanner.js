const mongoose = require('mongoose');

const heroBannerSchema = new mongoose.Schema({
    title: {
        type: String,
        default: ""
    },
    subtitle: {
        type: String,
        default: ""
    },
    image: {
        type: String,
        required: true
    },
    buttonText: {
        type: String,
        default: 'Browse Products'
    },
    buttonLink: {
        type: String,
        default: '/products'
    },
    order: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    hotspots: [{
        x: { type: Number, required: true },
        y: { type: Number, required: true },
        label: { type: String },
        productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
        productUrl: { type: String }
    }],
    transitionEffect: {
        type: String,
        enum: ['fade', 'slide-left', 'slide-right', 'zoom-in'],
        default: 'fade'
    },
    imageEffect: {
        type: String,
        enum: ['none', 'zoom-in', 'zoom-out', 'subtle-pan'],
        default: 'none'
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('HeroBanner', heroBannerSchema);
