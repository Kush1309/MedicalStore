import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
    const [mode, setMode] = useState(initialMode);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [isGoogleEnabled, setIsGoogleEnabled] = useState(false);

    // Form states
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [name, setName] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const { login, register, googleLogin } = useAuth();

    useEffect(() => {
        setMode(initialMode);
        setError('');
    }, [initialMode, isOpen]);

    useEffect(() => {
        // Check if Google OAuth is configured
        const checkGoogleStatus = async () => {
            try {
                // In a real scenario, this endpoint would check if google creds are set
                // For now we assume true as per existing logic, or fetch from an endpoint
                // const res = await axios.get('/api/auth/google/status');
                // setIsGoogleEnabled(res.data.configured);
                setIsGoogleEnabled(true);
            } catch (err) {
                console.log('Google Auth status check failed');
            }
        };
        checkGoogleStatus();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (mode === 'login') {
                await login(email, password);
                onClose();
            } else {
                if (password !== confirmPassword) {
                    throw new Error("Passwords do not match");
                }
                await register(name, email, password);
                onClose();
            }
            // Optional: Success notification
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Authentication failed');
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className={`modal ${isOpen ? 'active' : ''}`} style={{ display: isOpen ? 'flex' : 'none' }}>
            <div className="modal-content" style={{ maxWidth: '500px' }}>
                <button className="modal-close" onClick={onClose}>&times;</button>

                {mode === 'login' ? (
                    <div id="login-form-container">
                        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Welcome Back!</h2>

                        {isGoogleEnabled && (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    onClick={googleLogin}
                                >
                                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.30-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                        <path fill="none" d="M0 0h48v48H0z" />
                                    </svg>
                                    Continue with Google
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
                                    <div style={{ padding: '0 0.5rem' }}>OR</div>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
                                </div>
                            </>
                        )}

                        <form onSubmit={handleSubmit}>
                            {error && <div className="alert alert-error">{error}</div>}
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="Enter your password"
                                    minLength="6"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Logging in...' : 'Login'}
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
                            Don't have an account?{' '}
                            <a href="#" onClick={(e) => { e.preventDefault(); setMode('signup'); }} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                                Sign Up
                            </a>
                        </p>
                        <div style={{ textAlign: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                            <a href="/admin/login" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.85rem' }}>
                                Admin Access
                            </a>
                        </div>
                    </div>
                ) : (
                    <div id="signup-form-container">
                        <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>Create Account</h2>

                        {isGoogleEnabled && (
                            <>
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    style={{ width: '100%', marginBottom: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                                    onClick={googleLogin}
                                >
                                    <svg width="18" height="18" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48">
                                        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                                        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                                        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                                        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.30-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                                        <path fill="none" d="M0 0h48v48H0z" />
                                    </svg>
                                    Sign up with Google
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
                                    <div style={{ padding: '0 0.5rem' }}>OR</div>
                                    <div style={{ flex: 1, height: '1px', background: 'rgba(0,0,0,0.1)' }}></div>
                                </div>
                            </>
                        )}

                        <form onSubmit={handleSubmit}>
                            {error && <div className="alert alert-error">{error}</div>}
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    placeholder="your@email.com"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    placeholder="At least 6 characters"
                                    minLength="6"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    placeholder="Re-enter password"
                                    minLength="6"
                                />
                            </div>
                            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
                                {loading ? 'Signing up...' : 'Sign Up'}
                            </button>
                        </form>
                        <p style={{ textAlign: 'center', marginTop: '1.5rem', color: 'var(--text-secondary)' }}>
                            Already have an account?{' '}
                            <a href="#" onClick={(e) => { e.preventDefault(); setMode('login'); }} style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 600 }}>
                                Login
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthModal;
