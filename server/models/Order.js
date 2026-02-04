const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    name: String,
    image: String,
    price: Number,
    mrp: Number,
    quantity: {
        type: Number,
        required: true,
        min: 1
    },
    selectedColor: String,
    fulfillmentType: {
        type: String,
        enum: ['instock', 'made_to_order'],
        default: 'instock'
    },
    leadTimeDays: Number
});

const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    user: {
        name: { type: String, required: true },
        email: { type: String, required: true },
        phone: { type: String, required: true }
    },
    shippingAddress: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        landmark: String
    },
    items: [orderItemSchema],
    pricing: {
        subtotal: { type: Number, required: true },
        discount: { type: Number, default: 0 },
        gst: { type: Number, required: true },
        shippingCharges: { type: Number, default: 0 },
        total: { type: Number, required: true }
    },
    payment: {
        method: {
            type: String,
            enum: ['razorpay', 'cod'],
            default: 'razorpay'
        },
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
        status: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending'
        },
        paidAt: Date
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'processing', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled'],
        default: 'pending'
    },
    notes: String,
    agreedToTerms: {
        type: Boolean,
        required: true,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Generate order number
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const count = await mongoose.model('Order').countDocuments();
        this.orderNumber = `DSF${year}${month}${(count + 1).toString().padStart(5, '0')}`;
    }
    next();
});

module.exports = mongoose.model('Order', orderSchema);
