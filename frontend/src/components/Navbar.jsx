import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import AuthModal from './AuthModal';

const Navbar = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const { cartCount } = useCart();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const [authMode, setAuthMode] = useState('login');
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        setIsAuthModalOpen(false);
    }, []);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const openAuthModal = (mode = 'login') => {
        setAuthMode(mode);
        setIsAuthModalOpen(true);
        closeMobileMenu();
    };

    const handleLogout = () => {
        logout();
        closeMobileMenu();
    };

    return (
        <>
            <div className={`mobile-overlay ${isMobileMenuOpen ? 'active' : ''}`} onClick={closeMobileMenu}></div>

            <nav className="navbar">
                <div className="nav-container">
                    <Link to="/" className="logo">
                        <span className="logo-icon">⚕️</span>
                        Raj pharma
                    </Link>

                    <button
                        className="mobile-menu-toggle"
                        onClick={toggleMobileMenu}
                        aria-label="Toggle menu"
                    >
                        <span>{isMobileMenuOpen ? '✕' : '☰'}</span>
                    </button>

                    <ul className={`nav-links ${isMobileMenuOpen ? 'active' : ''}`} id="nav-links">
                        <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
                        <li><Link to="/shop" onClick={closeMobileMenu}>Shop</Link></li>

                        <li>
                            <a
                                href="#contact"
                                onClick={(e) => {
                                    e.preventDefault();
                                    closeMobileMenu();
                                    if (location.pathname === '/') {
                                        const element = document.getElementById('contact');
                                        if (element) {
                                            element.scrollIntoView({ behavior: 'smooth' });
                                        }
                                    } else {
                                        navigate('/', { state: { scrollTo: 'contact' } });
                                    }
                                }}
                            >
                                Inquiry
                            </a>
                        </li>
                        <li>
                            <Link to="/cart" style={{ position: 'relative' }} onClick={closeMobileMenu}>
                                🛒 Cart
                                <span className="cart-badge">{cartCount}</span>
                            </Link>
                        </li>

                        {!isAuthenticated ? (
                            <li className="responsive-flex-stack" style={{ gap: '0.5rem' }}>
                                <button onClick={() => openAuthModal('login')} className="btn btn-sm btn-primary">Login</button>
                                <button onClick={() => openAuthModal('signup')} className="btn btn-sm btn-outline">Sign Up</button>
                            </li>
                        ) : (
                            <li id="user-menu" style={{ position: 'relative' }}>
                                <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={(e) => e.preventDefault()}>
                                    <span>👤</span>
                                    <span>{user?.name || 'User'}</span>
                                </a>
                                <ul className="user-dropdown" style={{
                                    position: 'absolute',
                                    top: '100%',
                                    right: 0,
                                    background: 'var(--glass-bg)',
                                    backdropFilter: 'blur(10px)',
                                    borderRadius: 'var(--radius-md)',
                                    padding: '0.5rem',
                                    minWidth: '150px',
                                    display: 'none',
                                    boxShadow: 'var(--shadow-lg)'
                                }}>
                                    {user?.role === 'admin' && (
                                        <li>
                                            <a href="/admin" target="_self" style={{ padding: '0.5rem 1rem', display: 'block' }}>
                                                Admin Dashboard
                                            </a>
                                        </li>
                                    )}
                                    <li><Link to="/my-orders" style={{ padding: '0.5rem 1rem', display: 'block' }}>My Orders</Link></li>
                                    <li>
                                        <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} style={{ padding: '0.5rem 1rem', display: 'block', color: 'var(--error)' }}>
                                            Logout
                                        </a>
                                    </li>
                                </ul>
                            </li>
                        )}

                        {/* Mobile Only Admin Link */}
                        <li className="mobile-only">
                            <a href="/admin/login" onClick={closeMobileMenu}>Admin Login</a>
                        </li>
                    </ul>
                </div>
            </nav>

            <AuthModal
                isOpen={isAuthModalOpen}
                onClose={() => setIsAuthModalOpen(false)}
                initialMode={authMode}
            />
        </>
    );
};

export default Navbar;
