const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a product name'],
        trim: true
    },
    sku: {
        type: String,
        required: [true, 'Please add a SKU'],
        unique: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number
    },
    mrp: {
        type: Number
    },
    shortDescription: String,
    longDescription: String,
    features: [String],
    idealFor: [String],
    specifications: [
        {
            label: String,
            value: String
        }
    ],
    dimensions: {
        seatHeight: String,
        seatWidth: String,
        seatDepth: String,
        backHeight: String,
        armrestHeight: String,
        overallHeight: String,
        baseDiameter: String,
        netWeight: String
    },
    materialsUsed: [String],
    warranty: {
        coverage: [String],
        care: [String]
    },
    material: String, // Keep legacy field
    colors: [
        {
            name: { type: String, required: true },
            hex: String,
            sku: String,
            stock: { type: Number, default: 0 },
            status: { type: String, enum: ['In Stock', 'Low Stock', 'Out of Stock'], default: 'In Stock' },
            images: [String]
        }
    ],
    images: [String], // Array of image URLs/paths
    thumbnail: String,
    reviews: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            name: { type: String, required: true },
            rating: { type: Number, required: true, min: 1, max: 5 },
            comment: { type: String, required: true },
            isApproved: { type: Boolean, default: false },
            createdAt: { type: Date, default: Date.now }
        }
    ],
    averageRating: {
        type: Number,
        default: 0
    },
    reviewCount: {
        type: Number,
        default: 0
    },
    seoTitle: String,
    seoDescription: String,
    seoKeywords: [String],
    isAvailable: {
        type: Boolean,
        default: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    tags: [String],
    isBestSeller: {
        type: Boolean,
        default: false
    },
    isNewLaunch: {
        type: Boolean,
        default: false
    },
    isFeatured: {
        type: Boolean,
        default: false
    },
    discountPercent: {
        type: Number,
        default: 0
    },
    // Inventory Management
    stock: {
        type: Number,
        default: 0,
        required: true
    },
    minStock: {
        type: Number,
        default: 5
    },
    stockStatus: {
        type: String,
        enum: ['In Stock', 'Low Stock', 'Out of Stock'],
        default: 'In Stock'
    },
    allowBackorder: {
        type: Boolean,
        default: false
    },
    fulfillmentType: {
        type: String,
        enum: ['instock', 'made_to_order', 'hybrid'],
        default: 'instock'
    },
    leadTimeDays: {
        type: Number,
        default: 7
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Calculate average rating, discount, and stock status before saving
productSchema.pre('save', function (next) {
    // Inventory Calculation
    if (this.colors && this.colors.length > 0) {
        this.stock = this.colors.reduce((total, color) => total + (color.stock || 0), 0);
    }

    if (this.stock <= 0) {
        this.stockStatus = 'Out of Stock';
    } else if (this.stock <= (this.minStock || 5)) {
        this.stockStatus = 'Low Stock';
    } else {
        this.stockStatus = 'In Stock';
    }

    // Colors/Variants Status Sync
    if (this.colors && this.colors.length > 0) {
        this.colors.forEach(color => {
            if (color.stock <= 0) {
                color.status = 'Out of Stock';
            } else if (color.stock <= (this.minStock || 5)) {
                color.status = 'Low Stock';
            } else {
                color.status = 'In Stock';
            }
        });
    }

    // Calculate Review Stats (Only Approved)
    const approvedReviews = (this.reviews || []).filter(r => r.isApproved);
    if (approvedReviews.length > 0) {
        this.reviewCount = approvedReviews.length;
        const totalRating = approvedReviews.reduce((acc, item) => item.rating + acc, 0);
        this.averageRating = parseFloat((totalRating / approvedReviews.length).toFixed(1));
    } else {
        this.reviewCount = 0;
        this.averageRating = 0;
    }

    // Calculate Discount Percent
    if (this.mrp && this.price && this.mrp > this.price) {
        this.discountPercent = Math.round(((this.mrp - this.price) / this.mrp) * 100);
    } else {
        this.discountPercent = 0;
    }

    next();
});

module.exports = mongoose.model('Product', productSchema);
