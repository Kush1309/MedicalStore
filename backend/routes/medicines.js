const express = require('express');
const router = express.Router();
const Medicine = require('../models/Medicine');
const { protect, admin } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Upload image endpoint (admin only)
router.post('/upload-image', protect, admin, upload.single('image'), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        // Return the URL path to the uploaded image
        const imageUrl = `/uploads/${req.file.filename}`;
        res.json({ imageUrl });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all medicines (with optional category filter)
router.get('/', async (req, res) => {
    try {
        const { category, search } = req.query;
        console.log(`Medicine Search Request - Category: "${category}", Search: "${search}"`);

        let query = {};

        if (category && category !== 'All') {
            query.category = category;
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } }
            ];
        }

        const medicines = await Medicine.find(query).sort({ createdAt: -1 });
        res.json(medicines);
    } catch (error) {
        console.error('Error in GET /api/medicines:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get single medicine
router.get('/:id', async (req, res) => {
    try {
        const medicine = await Medicine.findById(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json(medicine);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create medicine (admin only)
router.post('/', protect, admin, async (req, res) => {
    try {
        const medicine = new Medicine(req.body);
        const newMedicine = await medicine.save();
        res.status(201).json(newMedicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Update medicine (admin only)
router.put('/:id', protect, admin, async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json(medicine);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete medicine (admin only)
router.delete('/:id', protect, admin, async (req, res) => {
    try {
        const medicine = await Medicine.findByIdAndDelete(req.params.id);
        if (!medicine) {
            return res.status(404).json({ message: 'Medicine not found' });
        }
        res.json({ message: 'Medicine deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
