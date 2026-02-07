import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminAPI } from '../services/api';
import '../styles/main.css';

const AdminDashboard = () => {
    const [adminUser, setAdminUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [logoutLoading, setLogoutLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyAdminAccess = async () => {
            try {
                const response = await adminAPI.checkStatus();

                if (response.data.authenticated && response.data.user?.role === 'admin') {
                    setAdminUser(response.data.user);
                    localStorage.setItem('adminUser', JSON.stringify(response.data.user));
                } else {
                    // Not authenticated as admin, redirect to login
                    navigate('/admin/login');
                }
            } catch (err) {
                console.error('Admin verification failed:', err);
                navigate('/admin/login');
            } finally {
                setLoading(false);
            }
        };

        verifyAdminAccess();
    }, [navigate]);

    const handleLogout = async () => {
        setLogoutLoading(true);
        try {
            await adminAPI.logout();
            localStorage.removeItem('adminUser');
            localStorage.removeItem('token');
            navigate('/admin/login');
        } catch (err) {
            console.error('Logout error:', err);
            // Still redirect even if API call fails
            localStorage.removeItem('adminUser');
            localStorage.removeItem('token');
            navigate('/admin/login');
        } finally {
            setLogoutLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="admin-dashboard-loading">
                <div className="spinner-large"></div>
                <p>Loading admin dashboard...</p>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="admin-title">
                        <h1>Admin Dashboard</h1>
                        <p>Welcome back, {adminUser?.name || 'Admin'}</p>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="admin-logout-btn"
                        disabled={logoutLoading}
                    >
                        {logoutLoading ? 'Logging out...' : 'Logout'}
                    </button>
                </div>
            </div>

            <div className="admin-content">
                <div className="admin-stats-grid">
                    <div className="admin-stat-card">
                        <div className="stat-icon orders-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <h3>Total Orders</h3>
                            <p className="stat-value">Coming Soon</p>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="stat-icon products-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <h3>Products</h3>
                            <p className="stat-value">Coming Soon</p>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="stat-icon users-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
                                <circle cx="9" cy="7" r="4" />
                                <path d="M23 21v-2a4 4 0 00-3-3.87m-4-12a4 4 0 010 7.75" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <h3>Total Users</h3>
                            <p className="stat-value">Coming Soon</p>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="stat-icon revenue-icon">
                            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23" />
                                <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                            </svg>
                        </div>
                        <div className="stat-info">
                            <h3>Revenue</h3>
                            <p className="stat-value">Coming Soon</p>
                        </div>
                    </div>
                </div>

                <div className="admin-info-card">
                    <h2>Admin Information</h2>
                    <div className="admin-info-grid">
                        <div className="info-item">
                            <span className="info-label">Name:</span>
                            <span className="info-value">{adminUser?.name || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Email:</span>
                            <span className="info-value">{adminUser?.email || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">Role:</span>
                            <span className="info-value admin-role-badge">{adminUser?.role || 'N/A'}</span>
                        </div>
                        <div className="info-item">
                            <span className="info-label">User ID:</span>
                            <span className="info-value">{adminUser?._id || 'N/A'}</span>
                        </div>
                    </div>
                </div>

                <div className="admin-actions-card">
                    <h2>Quick Actions</h2>
                    <div className="admin-actions-grid">
                        <button className="action-btn" disabled>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 4v16m8-8H4" />
                            </svg>
                            Add Product
                            <span className="coming-soon-badge">Soon</span>
                        </button>
                        <button className="action-btn" disabled>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            View Orders
                            <span className="coming-soon-badge">Soon</span>
                        </button>
                        <button className="action-btn" disabled>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Manage Users
                            <span className="coming-soon-badge">Soon</span>
                        </button>
                        <button className="action-btn" disabled>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                            View Analytics
                            <span className="coming-soon-badge">Soon</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
