import React from 'react';
import { useCart } from '../context/CartContext';

const ProductCard = ({ medicine }) => {
    const { addToCart } = useCart();

    const handleAddToCart = () => {
        addToCart(medicine);
        // Optional: Show toast
    };

    // Calculate discount
    const discount = medicine.discount || 0;
    const hasDiscount = discount > 0;
    const originalPrice = medicine.price;
    const discountedPrice = hasDiscount
        ? (originalPrice * (1 - discount / 100)).toFixed(2)
        : originalPrice;

    return (
        <div className="card fade-in" style={{ position: 'relative' }}>
            {hasDiscount && (
                <span
                    className="badge badge-success"
                    style={{
                        position: 'absolute',
                        top: '0.5rem',
                        right: '0.5rem',
                        zIndex: 10,
                        fontSize: '0.75rem',
                        fontWeight: '700'
                    }}
                >
                    {discount}% OFF
                </span>
            )}
            <span
                className="badge badge-primary"
                style={{ marginBottom: '0.5rem', display: 'inline-block' }}
            >
                {medicine.category}
            </span>
            <img
                src={medicine.image}
                alt={medicine.name}
                className="card-image"
                onError={(e) => {
                    // Fallback image handling
                    if (e.target.src !== '/images/medicine-placeholder.png') {
                        e.target.src = '/images/medicine-placeholder.png'; // Make sure this exists in public/images
                    }
                }}
            />
            <h3 className="card-title">{medicine.name}</h3>
            <p className="card-description">
                {medicine.description?.substring(0, 80)}...
            </p>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem', margin: '0.5rem 0' }}>
                By {medicine.manufacturer}
            </p>
            <div className="card-footer">
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    {hasDiscount && (
                        <span style={{
                            fontSize: '0.875rem',
                            color: 'var(--text-muted)',
                            textDecoration: 'line-through',
                            marginBottom: '0.25rem'
                        }}>
                            ₹{originalPrice}
                        </span>
                    )}
                    <span className="price" style={{ color: hasDiscount ? 'var(--secondary)' : 'inherit' }}>
                        ₹{discountedPrice}
                    </span>
                </div>
                <button
                    className="btn-add-to-cart"
                    onClick={handleAddToCart}
                >
                    <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    Add to Cart
                </button>
            </div>
        </div>
    );
};

export default ProductCard;
