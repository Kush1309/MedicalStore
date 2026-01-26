require('dotenv').config();
const mongoose = require('mongoose');
const Medicine = require('./models/Medicine');
const connectDB = require('./config/db');

const sampleMedicines = [
    {
        name: 'Paracetamol 500mg',
        description: 'Effective pain relief and fever reducer. Safe for adults and children.',
        price: 45,
        category: 'Pain Relief',
        manufacturer: 'PharmaCorp',
        stock: 150,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
        name: 'Amoxicillin 250mg',
        description: 'Broad-spectrum antibiotic for bacterial infections.',
        price: 120,
        category: 'Antibiotics',
        manufacturer: 'MediLife',
        stock: 80,
        prescription_required: true,
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
    },
    {
        name: 'Vitamin C 1000mg',
        description: 'Immune system support and antioxidant supplement.',
        price: 250,
        category: 'Vitamins',
        manufacturer: 'HealthPlus',
        stock: 200,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1550572017-4814c6f55999?w=300&h=300&fit=crop'
    },
    {
        name: 'Cetirizine 10mg',
        description: 'Antihistamine for allergy relief and cold symptoms.',
        price: 65,
        category: 'Cold & Flu',
        manufacturer: 'AllerCare',
        stock: 120,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    },
    {
        name: 'Metformin 500mg',
        description: 'Blood sugar control medication for type 2 diabetes.',
        price: 180,
        category: 'Diabetes',
        manufacturer: 'DiabeCare',
        stock: 90,
        prescription_required: true,
        image: 'https://images.unsplash.com/photo-1628771065518-0d82f1938462?w=300&h=300&fit=crop'
    },
    {
        name: 'Atorvastatin 20mg',
        description: 'Cholesterol-lowering medication for heart health.',
        price: 220,
        category: 'Heart Care',
        manufacturer: 'CardioMed',
        stock: 75,
        prescription_required: true,
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=300&fit=crop'
    },
    {
        name: 'Omeprazole 20mg',
        description: 'Reduces stomach acid for heartburn and acid reflux relief.',
        price: 95,
        category: 'Digestive',
        manufacturer: 'GastroHealth',
        stock: 110,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    {
        name: 'Ibuprofen 400mg',
        description: 'Anti-inflammatory pain reliever for headaches and muscle pain.',
        price: 55,
        category: 'Pain Relief',
        manufacturer: 'PainAway',
        stock: 160,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?w=300&h=300&fit=crop'
    },
    {
        name: 'Multivitamin Complex',
        description: 'Complete daily vitamin and mineral supplement.',
        price: 350,
        category: 'Vitamins',
        manufacturer: 'VitaBoost',
        stock: 140,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1550572017-4814c6f55999?w=300&h=300&fit=crop'
    },
    {
        name: 'Cough Syrup',
        description: 'Soothing relief for dry and wet cough.',
        price: 85,
        category: 'Cold & Flu',
        manufacturer: 'CoughCare',
        stock: 95,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1471864190281-a93a3070b6de?w=300&h=300&fit=crop'
    },
    {
        name: 'Aspirin 75mg',
        description: 'Low-dose aspirin for heart attack prevention.',
        price: 40,
        category: 'Heart Care',
        manufacturer: 'CardioShield',
        stock: 180,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=300&h=300&fit=crop'
    },
    {
        name: 'Probiotic Capsules',
        description: 'Supports digestive health and gut flora balance.',
        price: 420,
        category: 'Digestive',
        manufacturer: 'GutHealth',
        stock: 65,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=300&h=300&fit=crop'
    },
    // Beauty Products
    {
        name: 'Gentle Skin Cleanser',
        description: 'Mild, non-irritating formula for all skin types.',
        price: 350,
        category: 'Beauty',
        manufacturer: 'Cetaphil',
        stock: 50,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1556228720-1957be83d312?w=300&h=300&fit=crop'
    },
    {
        name: 'Soft Moisturizing Cream',
        description: 'Intensive moisturizing cream for soft and supple skin.',
        price: 200,
        category: 'Beauty',
        manufacturer: 'Nivea',
        stock: 100,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=300&h=300&fit=crop'
    },
    // Perfume Products
    {
        name: 'Royal Ocean Body Spray',
        description: 'Long-lasting fragrance for men with ocean freshness.',
        price: 190,
        category: 'Perfume',
        manufacturer: 'Fogg',
        stock: 80,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1594035910387-fea477942698?w=300&h=300&fit=crop'
    },
    {
        name: 'Femme Floral Perfume',
        description: 'Elegant floral scent for women engaged in active lifestyle.',
        price: 250,
        category: 'Perfume',
        manufacturer: 'Engage',
        stock: 60,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=300&h=300&fit=crop'
    },
    // Protection Products
    {
        name: 'Advanced N95 Face Mask',
        description: 'High filtration efficiency mask for protection against pollutants and viruses.',
        price: 150,
        category: 'Protection',
        manufacturer: 'Wildcraft',
        stock: 200,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1586942593568-29361efcd571?w=300&h=300&fit=crop'
    },
    {
        name: 'Instant Hand Sanitizer',
        description: 'Kills 99.9% of germs without water.',
        price: 100,
        category: 'Protection',
        manufacturer: 'Dettol',
        stock: 150,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=300&h=300&fit=crop'
    },
    {
        name: 'Comprehensive First Aid Kit',
        description: 'Essential medical supplies for emergency situations.',
        price: 500,
        category: 'Protection',
        manufacturer: 'Dettol',
        stock: 30,
        prescription_required: false,
        image: 'https://images.unsplash.com/photo-1624638763480-466d6c975a5d?w=300&h=300&fit=crop'
    }
];

// (No direct placeholders found in seed.js as it uses Unsplash, but good to check others)
const seedDatabase = async () => {
    try {
        await connectDB();

        // Clear existing medicines
        await Medicine.deleteMany({});
        console.log('Cleared existing medicines');

        // Insert sample medicines
        await Medicine.insertMany(sampleMedicines);
        console.log('Sample medicines added successfully');

        console.log(`${sampleMedicines.length} medicines have been seeded to the database`);
        process.exit(0);
    } catch (error) {
        console.error('Error seeding database:', error);
        process.exit(1);
    }
};

seedDatabase();
