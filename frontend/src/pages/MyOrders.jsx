import React, { useEffect, useState } from 'react';
import { orderAPI } from '../services/api';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const response = await orderAPI.getMyOrders();
                setOrders(response.data);
            } catch (err) {
                console.error('Error fetching orders:', err);
                setError('Failed to load your orders.');
            } finally {
                setLoading(false);
            }
        };

        fetchOrders();
    }, []);

    if (loading) return <div className="container"><div className="spinner"></div></div>;
    if (error) return <div className="container"><div className="alert alert-error">{error}</div></div>;

    return (
        <div className="container">
            <h1 style={{ marginBottom: '2rem' }}>My Orders</h1>

            {orders.length === 0 ? (
                <div className="text-center glass" style={{ padding: '3rem' }}>
                    <h3>No orders found</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>You haven't placed any orders yet.</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {orders.map(order => (
                        <div key={order._id} className="glass" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Order ID</span>
                                    <div style={{ fontWeight: 'bold' }}>#{order._id.substring(order._id.length - 8).toUpperCase()}</div>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Date</span>
                                    <div>{new Date(order.createdAt).toLocaleDateString()}</div>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Status</span>
                                    <div>
                                        <span className={`badge badge-${order.status === 'Delivered' ? 'success' : order.status === 'Cancelled' ? 'error' : 'info'}`}>
                                            {order.status}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Amount</span>
                                    <div style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>₹{order.totalAmount}</div>
                                </div>
                            </div>

                            <div className="table-container">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Product</th>
                                            <th>Price</th>
                                            <th>Qty</th>
                                            <th>Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {order.items.map((item, index) => (
                                            <tr key={index}>
                                                <td>{item.medicine?.name || 'Product'}</td>
                                                <td>₹{item.price}</td>
                                                <td>{item.quantity}</td>
                                                <td>₹{item.price * item.quantity}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MyOrders;
