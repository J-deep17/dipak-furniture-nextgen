const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        unique: true,
        enum: ['privacy', 'terms', 'shipping', 'cancellation', 'warranty']
    },
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    content: {
        type: String,
        required: true
    },
    lastUpdated: {
        type: Date,
        default: Date.now
    },
    isActive: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true
});

// Update lastUpdated on save
policySchema.pre('save', function (next) {
    this.lastUpdated = new Date();
    next();
});

module.exports = mongoose.model('Policy', policySchema);
