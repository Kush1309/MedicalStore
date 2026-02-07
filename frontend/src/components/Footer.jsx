import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const handleNewsletterSubmit = (e) => {
        e.preventDefault();
        alert('Thank you for subscribing!'); // Replace with toast notification later
    };

    return (
        <footer className="site-footer">
            <div className="container">
                {/* Brand Section */}
                <div className="footer-brand">
                    <Link to="/" className="footer-brand-logo">
                        <span>⚕️</span>
                        <h3>Raj pharma</h3>
                    </Link>
                    <p className="footer-description">
                        Raj pharma is one of India's most trusted pharmacies, dispensing quality medicines at reasonable
                        prices to millions of happy customers - PAN India.
                    </p>
                </div>

                {/* Footer Columns */}
                <div className="footer-grid">
                    {/* Company Column */}
                    <div>
                        <h4 className="footer-heading">COMPANY</h4>
                        <ul className="footer-links">
                            <li><a href="#">About Raj pharma</a></li>
                            <li><a href="#">Career</a></li>
                            <li><a href="#">Sitemap</a></li>
                            <li><a href="/secure-admin-login">Admin Login</a></li>
                        </ul>
                    </div>

                    {/* Our Policies Column */}
                    <div>
                        <h4 className="footer-heading">OUR POLICIES</h4>
                        <ul className="footer-links">
                            <li><a href="#">Terms & Conditions</a></li>
                            <li><a href="#">Privacy Policy</a></li>
                            <li><a href="#">Fees & Payments Policy</a></li>
                            <li><a href="#">Shipping & Delivery Policy</a></li>
                            <li><a href="#">Return Refund Cancellation Policy</a></li>
                            <li><a href="#">Editorial Policy</a></li>
                            <li><a href="#">Caution Notice</a></li>
                        </ul>
                    </div>

                    {/* Shopping Column */}
                    <div>
                        <h4 className="footer-heading">SHOPPING</h4>
                        <ul className="footer-links">
                            <li><Link to="/shop">Medicines A to Z</Link></li>
                            <li><Link to="/shop">Shop by Categories</Link></li>
                            <li><a href="#">Offers & Coupons</a></li>
                            <li><a href="#">FAQs</a></li>
                            <li><a href="#contact">Contact Us</a></li>
                        </ul>
                    </div>

                    {/* Social Column */}
                    <div>
                        <h4 className="footer-heading">SOCIAL</h4>
                        <ul className="footer-links">
                            <li><a href="#">Facebook</a></li>
                            <li><a href="#">Twitter</a></li>
                            <li><a href="#">LinkedIn</a></li>
                            <li><a href="#">Youtube</a></li>
                            <li><a href="#">Instagram</a></li>
                        </ul>
                    </div>

                    {/* Newsletter Column */}
                    <div>
                        <h4 className="footer-heading">SUBSCRIBE TO OUR NEWSLETTER</h4>
                        <p className="footer-description" style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
                            Get a free subscription to our health and fitness tips, in-depth articles and exclusive updates.
                        </p>
                        <form onSubmit={handleNewsletterSubmit} style={{ display: 'flex', gap: '0.5rem' }}>
                            <input
                                type="email"
                                placeholder="enter your email address"
                                required
                                style={{
                                    flex: 1,
                                    padding: '0.75rem 1rem',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    background: 'rgba(0,0,0,0.2)',
                                    borderRadius: '8px',
                                    fontSize: '0.9rem',
                                    color: 'white',
                                    outline: 'none',
                                    transition: 'border-color 0.2s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = 'var(--primary)'}
                                onBlur={(e) => e.target.style.borderColor = 'rgba(255,255,255,0.1)'}
                            />
                            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 1.25rem' }}>
                                <span>→</span>
                            </button>
                        </form>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="footer-bottom">
                    <p>
                        © 2024 Raj pharma. All Rights Reserved | Author: Kushagra | Contact: 6394109197 | Location: Kanpur nagar
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
