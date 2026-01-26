require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

console.log('--- Debugging Admin Login ---');
console.log('CWD:', process.cwd());
console.log('ADMIN_EMAIL env:', process.env.ADMIN_EMAIL);
console.log('ADMIN_PASSWORD env:', process.env.ADMIN_PASSWORD ? '******' : 'MISSING');
console.log('MONGO_URI exists:', !!process.env.MONGO_URI);

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connected');

        const email = process.env.ADMIN_EMAIL;
        console.log(`Checking for user: ${email}`);

        let adminUser = await User.findOne({ email });

        if (!adminUser) {
            console.log('User not found. Simulating creation...');
            try {
                // Simulate creation
                adminUser = new User({
                    name: 'Admin',
                    email: email,
                    password: process.env.ADMIN_PASSWORD,
                    role: 'admin',
                    authProvider: 'local'
                });
                // Validate without saving
                await adminUser.validate();
                console.log('User creation validation passed.');
            } catch (err) {
                console.error('User creation validation FAILED:', err);
            }
        } else {
            console.log('User found:', adminUser);
            if (adminUser.role !== 'admin') {
                console.log('User is not admin. Simulating update...');
                adminUser.role = 'admin';
                try {
                    await adminUser.validate(); // check if valid
                    console.log('User update validation passed.');
                } catch (err) {
                    console.error('User update validation FAILED:', err);
                }
            } else {
                console.log('User is already admin.');
            }
        }

        console.log('Done.');
        process.exit(0);

    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

if (!process.env.MONGO_URI) {
    console.error('MONGO_URI missing in .env');
} else {
    connectDB();
}
