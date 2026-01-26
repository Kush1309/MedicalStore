const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken } = require('../middleware/auth');

// Customer Registration
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        if (password.length < 6) {
            return res.status(400).json({ message: 'Password must be at least 6 characters' });
        }

        // Check if it's the Admin email
        const adminEmail = process.env.ADMIN_EMAIL || 'kushagrasaxena1309@gmail.com';
        if (email.toLowerCase() === adminEmail.toLowerCase()) {
            return res.status(400).json({
                message: 'This email is reserved for administrative access. Please login instead.'
            });
        }

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists with this email. Please login.' });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: 'customer'
        });

        if (user) {
            res.status(201).json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        console.error('Registration error:', error);
        // Provide more descriptive error if it's a Mongoose validation error
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return res.status(400).json({ message: messages.join(', ') });
        }
        res.status(500).json({ message: error.message || 'Internal Server Error' });
    }
});

// Customer/Admin Login
router.post('/login', async (req, res) => {
    try {
        const { email, password, username } = req.body;

        let user;

        // Check if it's admin login (username) or customer login (email)
        if (username) {
            // Admin login with environment variables (legacy support)
            if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
                return res.json({
                    success: true,
                    user: {
                        username,
                        role: 'admin'
                    },
                    // For admin, we don't use JWT in the current implementation
                    // This maintains backward compatibility
                });
            } else {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
        } else if (email) {

            // Special check for Admin Email
            if (email === process.env.ADMIN_USERNAME || email === 'kushagrasaxena1309@gmail.com') {
                if (password === process.env.ADMIN_PASSWORD) {
                    // Check if admin exists in DB, if not create/update
                    let adminUser = await User.findOne({ email });
                    if (!adminUser) {
                        adminUser = await User.create({
                            name: 'Admin',
                            email: email,
                            username: 'admin',
                            password: password, // This will be hashed by pre-save hook
                            role: 'admin',
                            authProvider: 'local'
                        });
                    } else {
                        // Ensure role is admin
                        if (adminUser.role !== 'admin') {
                            adminUser.role = 'admin';
                            await adminUser.save();
                        }
                    }

                    return res.json({
                        success: true,
                        _id: adminUser._id,
                        name: adminUser.name,
                        email: adminUser.email,
                        role: 'admin',
                        token: generateToken(adminUser._id)
                    });
                } else {
                    return res.status(401).json({ message: 'Invalid Admin Password' });
                }
            }

            // Customer login with database
            user = await User.findOne({ email });

            if (!user) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            // Check password
            const isMatch = await user.matchPassword(password);

            if (!isMatch) {
                return res.status(401).json({ message: 'Invalid email or password' });
            }

            res.json({
                success: true,
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                token: generateToken(user._id)
            });
        } else {
            res.status(400).json({ message: 'Please provide email or username' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: error.message });
    }
});

// Get current user profile (requires authentication)
router.get('/me', async (req, res) => {
    try {
        // Extract token from header
        const token = req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({ message: 'Not authorized' });
        }

        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(401).json({ message: 'Not authorized' });
    }
});

// Google OAuth Routes
const passport = require('passport');

// Check if Google OAuth is configured
router.get('/google/status', (req, res) => {
    const isConfigured = process.env.GOOGLE_CLIENT_ID &&
        process.env.GOOGLE_CLIENT_ID !== 'YOUR_GOOGLE_CLIENT_ID' &&
        process.env.GOOGLE_CLIENT_SECRET &&
        process.env.GOOGLE_CLIENT_SECRET !== 'YOUR_GOOGLE_CLIENT_SECRET';

    res.json({ configured: isConfigured });
});

// Initiate Google OAuth login
router.get('/google',
    passport.authenticate('google', {
        scope: ['profile', 'email']
    })
);

// Google OAuth callback
router.get('/google/callback',
    passport.authenticate('google', {
        failureRedirect: '/index.html',
        session: false
    }),
    async (req, res) => {
        try {
            // Generate JWT token for the authenticated user
            const token = generateToken(req.user._id);

            // Redirect to frontend with token in URL
            // Frontend will extract token and store it
            res.redirect(`/index.html?googleAuth=success&token=${token}&userId=${req.user._id}&name=${encodeURIComponent(req.user.name)}&email=${encodeURIComponent(req.user.email)}&role=${req.user.role}`);
        } catch (error) {
            console.error('Google callback error:', error);
            res.redirect('/index.html?googleAuth=error');
        }
    }
);

module.exports = router;

