const express = require('express');
const router = express.Router();
const Inquiry = require('../models/Inquiry');
const { protect, admin } = require('../middleware/auth');
const XLSX = require('xlsx');

// Create a new inquiry (public)
router.post('/', async (req, res) => {
    try {
        const inquiry = new Inquiry(req.body);
        const newInquiry = await inquiry.save();
        res.status(201).json(newInquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all inquiries (admin only)
router.get('/', protect, admin, async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });
        res.json(inquiries);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Update inquiry status (admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const inquiry = await Inquiry.findByIdAndUpdate(
            req.params.id,
            { status: req.body.status },
            { new: true }
        );
        if (!inquiry) return res.status(404).json({ message: 'Inquiry not found' });
        res.json(inquiry);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Export inquiries to Excel (admin only)
router.get('/export', protect, admin, async (req, res) => {
    try {
        const inquiries = await Inquiry.find().sort({ createdAt: -1 });

        const data = inquiries.map(inqu => ({
            'Name': inqu.name,
            'Email': inqu.email,
            'Phone': inqu.phone,
            'Address': inqu.address,
            'Message': inqu.message,
            'Status': inqu.status,
            'Date': inqu.createdAt.toLocaleString()
        }));

        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(data);
        XLSX.utils.book_append_sheet(wb, ws, 'Inquiries');

        const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=inquiries.xlsx');
        res.send(buffer);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
