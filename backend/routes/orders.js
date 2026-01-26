const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Medicine = require('../models/Medicine');
const { protect, admin } = require('../middleware/auth');

// Export orders to Excel (admin only)
router.get('/export', protect, admin, async (req, res) => {
    try {
        const XLSX = require('xlsx');
        const orders = await Order.find().populate('items.medicine').populate('user', 'name email').sort({ createdAt: -1 });

        const data = orders.map(order => ({
            'Order ID': order._id.toString(),
            'Customer Name': order.customer.name,
            'Customer Email': order.customer.email,
            'Customer Phone': order.customer.phone,
            'Customer Address': order.customer.address,
            'Items': order.items.map(i => `${i.name} (${i.quantity})`).join(', '),
            'Total Amount': order.totalAmount,
            'Status': order.status,
            'Payment Method': order.paymentMethod,
            'Payment Status': order.paymentStatus,
            'Date': order.createdAt.toLocaleString()
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Orders');

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=orders.xlsx');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all orders (admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const orders = await Order.find().populate('items.medicine').populate('user', 'name email').sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get user's own orders (authenticated users only)
router.get('/my-orders', protect, async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate('items.medicine')
            .sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get single order
router.get('/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('items.medicine');
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create new order
router.post('/', async (req, res) => {
    try {
        // Check if user is authenticated (optional - supports guest checkout)
        let userId = null;
        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            try {
                const jwt = require('jsonwebtoken');
                const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';
                const token = req.headers.authorization.split(' ')[1];
                const decoded = jwt.verify(token, JWT_SECRET);
                userId = decoded.id;
            } catch (error) {
                // Token invalid or expired, proceed as guest
                console.log('Invalid token, proceeding as guest');
            }
        }

        // Validate stock availability
        for (const item of req.body.items) {
            const medicine = await Medicine.findById(item.medicine);
            if (!medicine) {
                return res.status(404).json({ message: `Medicine ${item.name} not found` });
            }
            if (medicine.stock < item.quantity) {
                return res.status(400).json({
                    message: `Insufficient stock for ${medicine.name}. Available: ${medicine.stock}`
                });
            }
        }

        // Create order with user reference if authenticated
        const orderData = {
            ...req.body,
            user: userId // Will be null for guest checkout
        };
        const order = new Order(orderData);
        const newOrder = await order.save();

        // Update stock
        for (const item of req.body.items) {
            await Medicine.findByIdAndUpdate(
                item.medicine,
                { $inc: { stock: -item.quantity } }
            );
        }

        res.status(201).json(newOrder);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update order status (admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const order = await Order.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }
        res.json(order);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});



module.exports = router;
