const jwt = require('jsonwebtoken');
const User = require('../models/User');

// JWT Secret (in production, this should be in .env)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-this-in-production';

// Session timeout in milliseconds (30 minutes)
const SESSION_TIMEOUT = 30 * 60 * 1000;

// Track last activity for session timeout
const sessionActivity = new Map();

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token;

    // Check for token in cookies first (more secure)
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        // Fallback to Authorization header
        token = req.headers.authorization.split(' ')[1];
    } else if (req.query.token) {
        // Get token from query params (for downloads)
        token = req.query.token;
    }

    if (!token) {
        return res.status(401).json({ message: 'Not authorized, no token' });
    }

    try {
        // Verify token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check session timeout
        const lastActivity = sessionActivity.get(decoded.id);
        if (lastActivity && Date.now() - lastActivity > SESSION_TIMEOUT) {
            sessionActivity.delete(decoded.id);
            return res.status(401).json({ message: 'Session expired due to inactivity' });
        }

        // Update last activity
        sessionActivity.set(decoded.id, Date.now());

        // Get user from token
        req.user = await User.findById(decoded.id).select('-password');

        if (!req.user) {
            return res.status(401).json({ message: 'User not found' });
        }

        next();
    } catch (error) {
        console.error(error);
        return res.status(401).json({ message: 'Not authorized, token failed' });
    }
};

// Admin only middleware - returns 404 to hide admin existence
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        // Return 404 instead of 403 to hide admin routes from discovery
        res.status(404).json({ message: 'Not found' });
    }
};

// Strict admin middleware - for critical admin-only routes
// Returns 404 for any non-admin access to hide the route's existence
const strictAdmin = async (req, res, next) => {
    let token;

    // Check for token in cookies first
    if (req.cookies && req.cookies.token) {
        token = req.cookies.token;
    } else if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        // Return 404 instead of 401 to hide admin route
        return res.status(404).send('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 - Page Not Found</h1></body></html>');
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);

        // Check session timeout
        const lastActivity = sessionActivity.get(decoded.id);
        if (lastActivity && Date.now() - lastActivity > SESSION_TIMEOUT) {
            sessionActivity.delete(decoded.id);
            return res.status(404).send('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 - Page Not Found</h1></body></html>');
        }

        // Update last activity
        sessionActivity.set(decoded.id, Date.now());

        const user = await User.findById(decoded.id).select('-password');

        if (!user || user.role !== 'admin') {
            // Return 404 for non-admin users
            return res.status(404).send('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 - Page Not Found</h1></body></html>');
        }

        req.user = user;
        next();
    } catch (error) {
        // Return 404 on any error to hide admin route
        return res.status(404).send('<!DOCTYPE html><html><head><title>404 Not Found</title></head><body><h1>404 - Page Not Found</h1></body></html>');
    }
};

// Clear session activity on logout
const clearSession = (userId) => {
    sessionActivity.delete(userId);
};

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, {
        expiresIn: '30d'
    });
};

// Set token in HttpOnly cookie
const setTokenCookie = (res, token) => {
    res.cookie('token', token, {
        httpOnly: true, // Prevents JavaScript access
        secure: process.env.NODE_ENV === 'production', // HTTPS only in production
        sameSite: 'strict', // CSRF protection
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
    });
};

// Clear token cookie
const clearTokenCookie = (res) => {
    res.cookie('token', '', {
        httpOnly: true,
        expires: new Date(0)
    });
};

module.exports = {
    protect,
    admin,
    strictAdmin,
    generateToken,
    setTokenCookie,
    clearTokenCookie,
    clearSession
};
