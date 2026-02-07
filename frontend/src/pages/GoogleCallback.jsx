import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const GoogleCallback = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth(); // We might need a method to set user directly, or just use localStorage
    // actually, AuthContext initializes from localStorage.

    useEffect(() => {
        const processCallback = () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const error = params.get('error');

            if (error) {
                // Handle error
                if (window.opener) {
                    window.opener.postMessage({ type: 'GOOGLE_AUTH_ERROR' }, window.location.origin);
                    window.close();
                } else {
                    navigate('/login?error=GoogleAuthFailed');
                }
                return;
            }

            if (token) {
                const userId = params.get('userId');
                const name = decodeURIComponent(params.get('name') || '');
                const email = decodeURIComponent(params.get('email') || '');
                const role = params.get('role');

                const userData = { _id: userId, name, email, role };

                // 1. Store in localStorage
                localStorage.setItem('token', token);
                localStorage.setItem('user', JSON.stringify(userData));

                // 2. Notify Opener (if popup)
                if (window.opener) {
                    window.opener.postMessage({
                        type: 'GOOGLE_AUTH_SUCCESS',
                        token,
                        user: userData
                    }, window.location.origin);
                    window.close();
                } else {
                    // 3. If not popup (redirect flow), navigate to home
                    // Force reload to ensure AuthContext picks up the changes
                    window.location.href = '/';
                }
            } else {
                navigate('/');
            }
        };

        processCallback();
    }, [location, navigate]);

    return (
        <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-primary)', color: 'white' }}>
            <div className="spinner"></div>
            <p style={{ marginTop: '1rem' }}>Processing login...</p>
        </div>
    );
};

export default GoogleCallback;
