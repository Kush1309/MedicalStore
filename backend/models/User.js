const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: function () {
            return this.role === 'customer';
        },
        trim: true
    },
    email: {
        type: String,
        required: function () {
            return this.role === 'customer';
        },
        unique: true,
        sparse: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    // username field removed as we use email for login
    password: {
        type: String,
        required: function () {
            // Password is only required for local auth (not Google OAuth)
            return this.authProvider === 'local';
        },
        minlength: 6
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true  // Allows null values while maintaining uniqueness
    },
    authProvider: {
        type: String,
        enum: ['local', 'google'],
        default: 'local'
    },
    role: {
        type: String,
        enum: ['admin', 'customer'],
        default: 'customer'
    }
}, {
    timestamps: true
});

// Hash password before saving (only for local auth)
userSchema.pre('save', async function (next) {
    // Skip password hashing if using Google OAuth or password hasn't changed
    if (!this.isModified('password') || !this.password) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
