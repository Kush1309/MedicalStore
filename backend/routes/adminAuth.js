const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { generateToken, setTokenCookie, clearTokenCookie, clearSession } = require('../middleware/auth');
const { loginLimiter } = require('../middleware/rateLimiter');

// Admin Login - Secret route with rate limiting
router.post('/login', loginLimiter, async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log('Admin login attempt for:', email);

        // Validation
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide all required fields' });
        }

        const inputEmail = email.toLowerCase();
        const adminEmailEnv = (process.env.ADMIN_EMAIL || '').toLowerCase();
        const adminUsernameEnv = (process.env.ADMIN_USERNAME || 'kushagrasaxena1309@gmail.com').toLowerCase();

        if (inputEmail !== adminEmailEnv && inputEmail !== adminUsernameEnv) {
            console.log('Admin login failed: Email mismatch');
            // Generic error message to not reveal if user exists
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check password
        if (password !== process.env.ADMIN_PASSWORD) {
            console.log('Admin login failed: Password mismatch');
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Find or create admin user in database
        let adminUser = await User.findOne({ email });

        if (!adminUser) {
            // Create admin user if doesn't exist
            adminUser = await User.create({
                name: 'Admin',
                email: email,
                password: password, // Will be hashed by pre-save hook
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

        // Generate token
        const token = generateToken(adminUser._id);

        // Set token in HttpOnly cookie
        setTokenCookie(res, token);

        // Return success with user data
        res.json({
            success: true,
            user: {
                _id: adminUser._id,
                name: adminUser.name,
                email: adminUser.email,
                role: adminUser.role
            },
            token // Also send in response for backward compatibility
        });

    } catch (error) {
        console.error('Admin login error:', error);
        // Generic error message
        res.status(500).json({ message: 'Error: ' + error.message });
    }
});

// Admin Logout - Clear session and cookie
router.post('/logout', async (req, res) => {
    try {
        // Get user ID from token if available
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (token) {
            const jwt = require('jsonwebtoken');
            const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

            try {
                const decoded = jwt.verify(token, JWT_SECRET);
                clearSession(decoded.id);
            } catch (err) {
                // Token invalid, continue with logout
            }
        }

        // Clear cookie
        clearTokenCookie(res);

        res.json({ success: true, message: 'Logged out successfully' });
    } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({ message: 'An error occurred during logout' });
    }
});

// Check admin session status
router.get('/status', async (req, res) => {
    try {
        const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];

        if (!token) {
            return res.json({ authenticated: false });
        }

        const jwt = require('jsonwebtoken');
        const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');

        if (!user || user.role !== 'admin') {
            return res.json({ authenticated: false });
        }

        res.json({
            authenticated: true,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.json({ authenticated: false });
    }
});

module.exports = router;
