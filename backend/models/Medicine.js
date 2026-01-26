const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: 0
    },
    category: {
        type: String,
        required: true,
        enum: ['Pain Relief', 'Antibiotics', 'Vitamins', 'Cold & Flu', 'Diabetes', 'Heart Care', 'Digestive', 'Children Products', 'Beauty', 'Perfume', 'Protection', 'Other']
    },
    manufacturer: {
        type: String,
        required: true
    },
    stock: {
        type: Number,
        required: true,
        min: 0,
        default: 0
    },
    image: {
        type: String,
        default: 'https://placehold.co/300x300?text=Medicine'
    },
    prescription_required: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Medicine', medicineSchema);
