const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

// Import routes
const medicineRoutes = require('./routes/medicines');
const orderRoutes = require('./routes/orders');
const authRoutes = require('./routes/auth');
const inquiryRoutes = require('./routes/inquiries');
const chatRoutes = require('./routes/chat');
const adminAuthRoutes = require('./routes/adminAuth');

// Import middleware
const { strictAdmin } = require('./middleware/auth');
const { apiLimiter } = require('./middleware/rateLimiter');

const app = express();

// Security middleware - helmet for security headers
app.use(helmet({
    contentSecurityPolicy: false, // Disable for now to avoid breaking inline scripts
    crossOriginEmbedderPolicy: false
}));

// Cookie parser - must be before routes that use cookies
app.use(cookieParser());

// Passport configuration
const passport = require('./config/passport');
const session = require('express-session');

// Session middleware (required for OAuth)
app.use(session({
    secret: process.env.SESSION_SECRET || 'your-session-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// CORS middleware
app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        // Allow localhost and netlify domains
        if (origin.includes('localhost') || origin.includes('127.0.0.1') || origin.includes('netlify.app')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve frontend files (static) from parent directory
app.use(express.static(path.join(__dirname, '../'))); // Serves index.html, shop.html, etc.

// Serve uploaded images
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
    next();
});

// Apply rate limiting to API routes
app.use('/api', apiLimiter);

// Public API Routes
app.use('/api/medicines', medicineRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/chat', chatRoutes);

// Secret Admin Authentication Routes (hidden, no public reference)
app.use('/api/secure-admin-auth', adminAuthRoutes);

// Secret Admin Login Page - accessible only via direct URL
app.get('/secure-admin-login', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'secure-admin-login.html'));
});

// Admin Dashboard - accessible if logged in as admin
// Client-side auth check in admin.html handles redirect
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'admin.html'));
});

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Medical Store API is running' });
});

// 404 handler for undefined routes
app.use((req, res) => {
    res.status(404).send(`
        <!DOCTYPE html>
        <html>
        <head>
            <title>404 Not Found</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    min-height: 100vh;
                    margin: 0;
                    background: #f5f5f5;
                }
                .container {
                    text-align: center;
                    padding: 2rem;
                }
                h1 {
                    font-size: 4rem;
                    margin: 0;
                    color: #333;
                }
                p {
                    font-size: 1.2rem;
                    color: #666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>404</h1>
                <p>Page Not Found</p>
            </div>
        </body>
        </html>
    `);
});

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;

// Connect to database and start server
const startServer = async () => {
    try {
        await connectDB();
        // Bind to 0.0.0.0 to listen on all interfaces (IPv4)
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`Server is running on port ${PORT}`);
            console.log(`Ready to accept connections at http://localhost:${PORT}`);
            console.log(`\n🔒 Security Features Enabled:`);
            console.log(`   - Rate limiting active`);
            console.log(`   - Helmet security headers`);
            console.log(`   - HttpOnly cookies`);
            console.log(`   - Session timeout (30 min)`);
            console.log(`\n🔑 Admin Access:`);
            console.log(`   - Login: http://localhost:${PORT}/secure-admin-login`);
            console.log(`   - Dashboard: http://localhost:${PORT}/admin (requires auth)`);
        });
    } catch (error) {
        console.error('Failed to connect to database:', error);
        process.exit(1);
    }
};

startServer();
