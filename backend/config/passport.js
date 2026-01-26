const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL || 'http://localhost:5000/api/auth/google/callback'
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Check if user already exists with this Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // User exists, return the user
                return done(null, user);
            }

            // Check if user exists with the same email (from local auth)
            user = await User.findOne({ email: profile.emails[0].value });

            if (user) {
                // User exists with email but not linked to Google
                // Link the Google account to existing user
                user.googleId = profile.id;
                user.authProvider = 'google';
                if (user.email === 'kushagrasaxena1309@gmail.com') {
                    user.role = 'admin';
                }
                await user.save();
                return done(null, user);
            }

            // Create new user
            const role = profile.emails[0].value === 'kushagrasaxena1309@gmail.com' ? 'admin' : 'customer';

            user = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                googleId: profile.id,
                authProvider: 'google',
                role: role
            });

            done(null, user);
        } catch (error) {
            console.error('Google OAuth error:', error);
            done(error, null);
        }
    }));

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
