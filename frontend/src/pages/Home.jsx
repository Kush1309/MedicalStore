import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { medicineAPI, inquiryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';

const Home = () => {
    const [featuredMedicines, setFeaturedMedicines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Inquiry form state
    const [inquiryData, setInquiryData] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
        message: ''
    });
    const [inquiryStatus, setInquiryStatus] = useState('');

    useEffect(() => {
        const loadFeatured = async () => {
            try {
                const response = await medicineAPI.getAll({ limit: 4 });
                // Assuming response.data is the array, or response.data.medicines
                // Adjust based on your actual API response structure
                const medicines = Array.isArray(response.data) ? response.data : response.data.medicines || [];
                setFeaturedMedicines(medicines.slice(0, 4));
            } catch (err) {
                console.error('Failed to load medicines', err);
                setError('Failed to load featured medicines');
            } finally {
                setLoading(false);
            }
        };

        loadFeatured();
    }, []);

    const location = useLocation();

    useEffect(() => {
        if (location.state?.scrollTo === 'contact' || location.hash === '#contact') {
            const element = document.getElementById('contact');
            if (element) {
                // Small timeout to ensure rendering is complete
                setTimeout(() => {
                    element.scrollIntoView({ behavior: 'smooth' });
                }, 100);
            }
        }
    }, [location]);

    const handleInquiryChange = (e) => {
        setInquiryData({
            ...inquiryData,
            [e.target.name]: e.target.value
        });
    };

    const handleInquirySubmit = async (e) => {
        e.preventDefault();
        setInquiryStatus('submitting');
        try {
            await inquiryAPI.create(inquiryData);
            setInquiryStatus('success');
            setInquiryData({ name: '', email: '', phone: '', address: '', message: '' });
            alert('Inquiry submitted successfully!');
        } catch (err) {
            console.error(err);
            setInquiryStatus('error');
            alert('Failed to submit inquiry.');
        }
    };

    return (
        <>
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content container">
                    <h1>Your Health, Our Priority</h1>
                    <p>Quality medicines delivered to your doorstep. Browse our extensive collection of trusted pharmaceutical products.</p>
                    <div className="hero-buttons">
                        <Link to="/shop" className="btn btn-primary">Shop Now</Link>
                        <a href="#featured" className="btn btn-outline">View Featured</a>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="container">
                <div className="grid grid-3">
                    <div className="card glass">
                        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>🚚</div>
                        <h3 className="card-title text-center">Fast Delivery</h3>
                        <p className="card-description text-center">Get your medicines delivered quickly and safely to your doorstep.</p>
                    </div>
                    <div className="card glass">
                        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>✓</div>
                        <h3 className="card-title text-center">Genuine Products</h3>
                        <p className="card-description text-center">100% authentic medicines from trusted manufacturers.</p>
                    </div>
                    <div className="card glass">
                        <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>💰</div>
                        <h3 className="card-title text-center">Best Prices</h3>
                        <p className="card-description text-center">Competitive pricing with regular discounts and offers.</p>
                    </div>
                </div>
            </section>

            {/* Featured Medicines */}
            <section className="container" id="featured">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #38bdf8 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Featured Medicines
                </h2>

                {loading ? (
                    <div className="spinner"></div>
                ) : error ? (
                    <div className="alert alert-error text-center">{error}</div>
                ) : (
                    <div className="grid grid-4">
                        {featuredMedicines.map(medicine => (
                            <ProductCard key={medicine._id} medicine={medicine} />
                        ))}
                    </div>
                )}
            </section>

            {/* Categories Section */}
            <section className="container">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #38bdf8 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Shop by Category
                </h2>
                <div className="grid grid-4">
                    {[
                        { name: 'Pain Relief', icon: '💊' },
                        { name: 'Antibiotics', icon: '🔬' },
                        { name: 'Vitamins', icon: '🌟' },
                        { name: 'Cold & Flu', icon: '🤧' },
                        { name: 'Children Products', icon: '👶' },
                        { name: 'Beauty', icon: '💄' },
                        { name: 'Perfume', icon: '🧴' },
                        { name: 'Protection', icon: '🛡️' }
                    ].map(cat => (
                        <Link key={cat.name} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="card glass" style={{ textDecoration: 'none', cursor: 'pointer', display: 'block' }}>
                            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>{cat.icon}</div>
                            <h3 className="card-title text-center">{cat.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Pamper Section - Replicating HTML content */}
            <section className="container">
                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', textAlign: 'center', background: 'linear-gradient(135deg, #38bdf8 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Pamper for Boy & More
                </h2>
                <div className="grid grid-4">
                    {[
                        { name: 'Diapers', icon: '👶', fullName: 'Diapers (Pamper)' },
                        { name: 'Baby Wipes', icon: '🧻' },
                        { name: 'Baby Skincare', icon: '🧴' },
                        { name: 'Baby Food', icon: '🥣' }
                    ].map(cat => (
                        <Link key={cat.name} to={`/shop?category=${encodeURIComponent(cat.name)}`} className="card glass" style={{ textDecoration: 'none', cursor: 'pointer', display: 'block' }}>
                            <div style={{ fontSize: '3rem', textAlign: 'center', marginBottom: '1rem' }}>{cat.icon}</div>
                            <h3 className="card-title text-center">{cat.fullName || cat.name}</h3>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Inquiry Section */}
            <section className="container" id="contact" style={{ marginTop: '4rem' }}>
                <div className="card glass" style={{ maxWidth: '800px', margin: '0 auto', padding: '2.5rem' }}>
                    <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2.5rem', background: 'linear-gradient(135deg, #38bdf8 0%, #a78bfa 100%)', WebkitBackgroundClip: 'text', backgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Quick Inquiry
                    </h2>
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '2rem' }}>
                        Have questions? Fill out the form below and we'll get back to you shortly.
                    </p>

                    <form onSubmit={handleInquirySubmit}>
                        <div className="grid grid-2 responsive-grid-1-mobile" style={{ marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="name"
                                    value={inquiryData.name}
                                    onChange={handleInquiryChange}
                                    required
                                    placeholder="John Doe"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Email Address</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    name="email"
                                    value={inquiryData.email}
                                    onChange={handleInquiryChange}
                                    required
                                    placeholder="john@example.com"
                                />
                            </div>
                        </div>
                        <div className="grid grid-2 responsive-grid-1-mobile" style={{ marginBottom: '1.5rem' }}>
                            <div className="form-group">
                                <label className="form-label">Phone Number</label>
                                <input
                                    type="tel"
                                    className="form-input"
                                    name="phone"
                                    value={inquiryData.phone}
                                    onChange={handleInquiryChange}
                                    required
                                    placeholder="+91 98765 43210"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Full Address</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    name="address"
                                    value={inquiryData.address}
                                    onChange={handleInquiryChange}
                                    required
                                    placeholder="123 Main St, City, State"
                                />
                            </div>
                        </div>
                        <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                            <label className="form-label">How can we help you?</label>
                            <textarea
                                className="form-textarea"
                                name="message"
                                value={inquiryData.message}
                                onChange={handleInquiryChange}
                                required
                                placeholder="Type your message here..."
                                style={{ minHeight: '120px' }}
                            ></textarea>
                        </div>
                        <div style={{ textAlign: 'center' }}>
                            <button type="submit" className="btn btn-primary" style={{ padding: '1rem 3rem' }} disabled={inquiryStatus === 'submitting'}>
                                {inquiryStatus === 'submitting' ? 'Submitting...' : 'Submit Inquiry'}
                            </button>
                        </div>
                    </form>
                </div>
            </section>
        </>
    );
};

export default Home;
