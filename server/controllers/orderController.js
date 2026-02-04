const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private (Authentication Required)
const createOrder = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user || !req.user._id) {
            return res.status(401).json({
                success: false,
                message: 'Authentication required. Please log in to place an order.'
            });
        }

        const { items } = req.body;

        // 1. Validate Stock Availability
        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return res.status(404).json({ message: `Product ${item.name} not found` });
            }

            const chosenFulfillment = item.fulfillmentType || 'instock';

            // Check Payment Method Rules
            if (req.body.payment?.method === 'cod') {
                if (chosenFulfillment === 'made_to_order') {
                    return res.status(400).json({
                        message: `Cash on Delivery is not available for Made to Order items (${item.name}). Online payment required.`
                    });
                }
            }

            // Check Stock only for In Stock items
            if (chosenFulfillment === 'instock') {
                // Check Global Stock
                if (product.stock < item.quantity && !product.allowBackorder) {
                    return res.status(400).json({
                        message: `Insufficient stock for ${product.name}. Available: ${product.stock}`
                    });
                }

                // Check Color Stock if color is selected
                if (item.selectedColor && product.colors && product.colors.length > 0) {
                    const color = product.colors.find(v => v.name === item.selectedColor);
                    if (color && color.stock < item.quantity && !product.allowBackorder) {
                        return res.status(400).json({
                            message: `Insufficient stock for ${product.name} (${item.selectedColor}). Available: ${color.stock}`
                        });
                    }
                }
            }
        }

        // 2. Decrement Stock (only for instock fulfillments)
        for (const item of items) {
            const chosenFulfillment = item.fulfillmentType || 'instock';
            if (chosenFulfillment === 'instock') {
                const product = await Product.findById(item.product);
                if (product) {
                    // Decrement Global Stock
                    product.stock -= item.quantity;

                    // Decrement Color Stock
                    if (item.selectedColor && product.colors && product.colors.length > 0) {
                        const color = product.colors.find(v => v.name === item.selectedColor);
                        if (color) {
                            color.stock -= item.quantity;
                        }
                    }
                    await product.save();
                }
            }
        }

        // 3. Create Order with authenticated user ID
        const order = new Order({
            ...req.body,
            userId: req.user._id  // Attach authenticated user ID
        });
        await order.save();

        res.status(201).json({
            success: true,
            order: {
                orderNumber: order.orderNumber,
                id: order._id,
                total: order.pricing.total
            }
        });
    } catch (error) {
        console.error('Create order error:', error);
        res.status(500).json({ message: 'Failed to create order', error: error.message });
    }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
    try {
        const { status, paymentStatus, page = 1, limit = 20 } = req.query;

        const filter = { isDeleted: { $ne: true } };
        if (status) filter.orderStatus = status;
        if (paymentStatus) filter['payment.status'] = paymentStatus;

        const orders = await Order.find(filter)
            .populate('items.product', 'name image')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const count = await Order.countDocuments(filter);

        res.json({
            orders,
            totalPages: Math.ceil(count / limit),
            currentPage: page,
            total: count
        });
    } catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Get single order
// @route   GET /api/orders/:id
// @access  Public (with order number) / Private/Admin
const getOrder = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if searching by order number or ID
        const query = id.startsWith('DSF')
            ? { orderNumber: id }
            : { _id: id };

        const order = await Order.findOne(query)
            .populate('items.product', 'name image slug');

        if (!order || order.isDeleted) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { orderStatus, notes } = req.body;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const previousStatus = order.orderStatus;
        order.orderStatus = orderStatus;
        if (notes) order.notes = notes;

        await order.save();

        // 3. Handle Stock Restoration on Cancellation (only for instock items)
        if (orderStatus === 'cancelled' && previousStatus !== 'cancelled') {
            for (const item of order.items) {
                if (item.fulfillmentType === 'instock') {
                    const product = await Product.findById(item.product);
                    if (product) {
                        product.stock += item.quantity;
                        if (item.selectedColor && product.colors && product.colors.length > 0) {
                            const color = product.colors.find(v => v.name === item.selectedColor);
                            if (color) color.stock += item.quantity;
                        }
                        await product.save();
                    }
                }
            }
        } else if (previousStatus === 'cancelled' && orderStatus !== 'cancelled') {
            // Restore decrement if for some reason we move out of cancelled (re-activated order)
            for (const item of order.items) {
                if (item.fulfillmentType === 'instock') {
                    const product = await Product.findById(item.product);
                    if (product) {
                        product.stock -= item.quantity;
                        if (item.selectedColor && product.colors && product.colors.length > 0) {
                            const color = product.colors.find(v => v.name === item.selectedColor);
                            if (color) color.stock -= item.quantity;
                        }
                        await product.save();
                    }
                }
            }
        }

        res.json({
            success: true,
            message: 'Order status updated',
            order
        });
    } catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

// @desc    Delete order (soft delete)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
const deleteOrder = async (req, res) => {
    try {
        const { id } = req.params;

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        order.isDeleted = true;
        await order.save();

        res.json({ message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Delete order error:', error);
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createOrder,
    getOrders,
    getOrder,
    updateOrderStatus,
    deleteOrder
};
