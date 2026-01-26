// API Configuration
// When deployed on Netlify, we can use the relative /api if we use a proxy
// Or we can specify a public backend URL here
const API_BASE_URL = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? '/api'
    : '/api'; // Keep as /api, but Netlify _redirects will proxy this to the actual backend URL


// API Client
const api = {
    // Medicines
    async getMedicines(category = '', search = '') {
        const params = new URLSearchParams();
        if (category) params.append('category', category);
        if (search) params.append('search', search);

        const response = await fetch(`${API_BASE_URL}/medicines?${params}`);
        if (!response.ok) throw new Error('Failed to fetch medicines');
        return response.json();
    },

    async getMedicine(id) {
        const response = await fetch(`${API_BASE_URL}/medicines/${id}`);
        if (!response.ok) throw new Error('Failed to fetch medicine');
        return response.json();
    },

    async createMedicine(data) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/medicines`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to create medicine');
        return response.json();
    },

    async updateMedicine(id, data) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to update medicine');
        return response.json();
    },

    async deleteMedicine(id) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/medicines/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to delete medicine');
        return response.json();
    },

    // Orders
    async getOrders() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch orders');
        return response.json();
    },

    async createOrder(data) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json'
        };

        // Add auth token if user is logged in
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create order');
        }
        return response.json();
    },

    async updateOrderStatus(id, status) {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ status })
        });
        if (!response.ok) throw new Error('Failed to update order');
        return response.json();
    },

    // Auth
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Invalid credentials');
        }
        return response.json();
    },

    async register(name, email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Registration failed');
        }
        return response.json();
    },

    async getProfile() {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to get profile');
        return response.json();
    },

    async getUserOrders() {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('Not authenticated');

        const response = await fetch(`${API_BASE_URL}/orders/my-orders`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to get orders');
        return response.json();
    },

    // Payment
    async createPaymentOrder(amount) {
        const response = await fetch(`${API_BASE_URL}/payment/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ amount, currency: 'INR' })
        });
        if (!response.ok) throw new Error('Failed to create payment order');
        return response.json();
    },

    async verifyPayment(paymentData) {
        const response = await fetch(`${API_BASE_URL}/payment/verify-payment`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(paymentData)
        });
        if (!response.ok) throw new Error('Payment verification failed');
        return response.json();
    },

    // Inquiries
    async createInquiry(data) {
        const response = await fetch(`${API_BASE_URL}/inquiries`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error('Failed to submit inquiry');
        return response.json();
    },

    async getInquiries() {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/inquiries`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) throw new Error('Failed to fetch inquiries');
        return response.json();
    },

    // Export URLs
    getOrdersExportUrl() {
        const token = localStorage.getItem('token');
        return `${API_BASE_URL}/orders/export?token=${token}`;
    },

    getInquiriesExportUrl() {
        const token = localStorage.getItem('token');
        return `${API_BASE_URL}/inquiries/export?token=${token}`;
    }
};
