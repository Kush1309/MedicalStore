import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { orderAPI } from '../services/api';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleCheckout = async () => {
        if (!isAuthenticated) {
            // Prompt login
            alert('Please login to checkout');
            // Or trigger auth modal if possible, or redirect
            return;
        }

        if (cart.length === 0) return;

        try {
            // Prepare order data
            const orderItems = cart.map(item => ({
                medicine: item._id, // Ensure your backend expects 'medicine' ID
                quantity: item.quantity,
                price: item.price
            }));

            const orderData = {
                items: orderItems,
                paymentMethod: 'COD', // Default for now
                totalAmount: cartTotal,
                shippingAddress: 'Address from User Profile' // In a real app, prompt for address
            };

            // For now, let's assume simple order creation
            await orderAPI.createOrder(orderData);

            clearCart();
            alert('Order placed successfully!');
            navigate('/my-orders');
        } catch (error) {
            console.error('Checkout failed:', error);
            alert(error.response?.data?.message || 'Checkout failed');
        }
    };

    return (
        <div className="container">
            <h1 className="text-center" style={{ marginBottom: '2rem' }}>Shopping Cart</h1>

            {cart.length === 0 ? (
                <div className="text-center" style={{ padding: '4rem', background: 'rgba(30, 41, 59, 0.5)', borderRadius: 'var(--radius-lg)' }}>
                    <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🛒</div>
                    <h2>Your cart is empty</h2>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Looks like you haven't added anything yet.</p>
                    <button className="btn btn-primary" onClick={() => navigate('/shop')}>Start Shopping</button>
                </div>
            ) : (
                <div className="cart-grid-container" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
                    {/* Cart Items */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {cart.map(item => (
                            <div key={item._id} className="glass cart-item" style={{ display: 'flex', alignItems: 'center', padding: '1rem', gap: '1rem' }}>
                                <img
                                    src={item.image || '/images/medicine-placeholder.png'}
                                    alt={item.name}
                                    style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h3 style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{item.name}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>₹{item.price} / unit</p>
                                </div>
                                <div className="cart-item-actions" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 'var(--radius-sm)' }}>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                            style={{ background: 'none', border: 'none', color: 'white', padding: '0.5rem 0.8rem', cursor: 'pointer' }}
                                        >-</button>
                                        <span style={{ padding: '0 0.5rem', fontWeight: 'bold' }}>{item.quantity}</span>
                                        <button
                                            onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                            style={{ background: 'none', border: 'none', color: 'white', padding: '0.5rem 0.8rem', cursor: 'pointer' }}
                                        >+</button>
                                    </div>
                                    <button
                                        onClick={() => removeFromCart(item._id)}
                                        className="btn btn-danger btn-sm"
                                        aria-label="Remove item"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Summary */}
                    <div className="glass" style={{ padding: '1.5rem', height: 'fit-content' }}>
                        <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.5rem' }}>Order Summary</h3>

                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Subtotal</span>
                            <span>₹{cartTotal}</span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                            <span style={{ color: 'var(--text-secondary)' }}>Shipping</span>
                            <span style={{ color: 'var(--success)' }}>Free</span>
                        </div>

                        <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', margin: '1rem 0', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '1.2rem' }}>
                            <span>Total</span>
                            <span style={{ color: 'var(--primary)' }}>₹{cartTotal}</span>
                        </div>

                        <button className="btn btn-primary" style={{ width: '100%' }} onClick={handleCheckout}>
                            Proceed to Checkout
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Cart;
