import axios from 'axios';

// Create axios instance
const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || '/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const message = error.response?.data?.message || 'Something went wrong';

        // Handle session expiry
        if (error.response?.status === 401) {
            // Optional: Logout user if 401
            // localStorage.removeItem('token');
            // localStorage.removeItem('user');
            // window.location.href = '/';
        }

        return Promise.reject({ ...error, message });
    }
);

export const authAPI = {
    login: (email, password) => api.post('api/secure-admin-auth/login', { email, password }),
    register: (userData) => api.post('/auth/register', userData),
    getProfile: () => api.get('/auth/me'),
    googleAuth: () => window.location.href = `${api.defaults.baseURL}/auth/google`
};

export const medicineAPI = {
    getAll: (params) => api.get('/medicines', { params }),
    getById: (id) => api.get(`/medicines/${id}`),
    getByCategory: (category) => api.get('/medicines', { params: { category } })
};

export const cartAPI = {
    getCart: () => api.get('/cart'),
    addToCart: (item) => api.post('/cart/add', item),
    removeFromCart: (itemId) => api.delete(`/cart/${itemId}`),
    updateQuantity: (itemId, quantity) => api.put(`/cart/${itemId}`, { quantity })
};

export const orderAPI = {
    createOrder: (orderData) => api.post('/orders', orderData),
    getMyOrders: () => api.get('/orders/my-orders'),
    getOrderById: (id) => api.get(`/orders/${id}`)
};

export const inquiryAPI = {
    create: (data) => api.post('/inquiries', data)
};

export const adminAPI = {
    login: (email, password) => api.post('/admin/login', { email, password }),
    logout: () => api.post('/admin/logout'),
    checkStatus: () => api.get('/admin/status')
};

export default api;
