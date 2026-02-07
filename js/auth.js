// Authentication Manager
const auth = {
    // Check if user is logged in
    isLoggedIn() {
        return !!localStorage.getItem('token');
    },

    // Get current user from localStorage
    getCurrentUser() {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Login user
    async login(email, password) {
        try {
            const response = await api.login(email, password);
            this.setAuth(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Register user
    async register(name, email, password) {
        try {
            const response = await api.register(name, email, password);
            this.setAuth(response);
            return response;
        } catch (error) {
            throw error;
        }
    },

    // Set authentication data
    setAuth(data) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify({
            _id: data._id,
            name: data.name,
            email: data.email,
            role: data.role
        }));
        this.updateUI();
    },

    // Logout user
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        this.updateUI();
        window.location.href = 'index.html';
    },

    // Update UI based on auth state
    updateUI() {
        const user = this.getCurrentUser();
        const authButtons = document.getElementById('auth-buttons');
        const userMenu = document.getElementById('user-menu');

        if (user) {
            // User is logged in
            if (authButtons) authButtons.style.display = 'none';
            if (userMenu) {
                userMenu.style.display = 'flex';
                const userName = document.getElementById('user-name');
                if (userName) userName.textContent = user.name;
            }

            // Show Admin link only if user role is admin
            const adminLink = document.getElementById('admin-dashboard-link') || document.querySelector('a[href="/admin"]');
            if (adminLink) {
                const li = adminLink.closest('li');
                if (li) li.style.display = user.role === 'admin' ? 'block' : 'none';
                else adminLink.style.display = user.role === 'admin' ? 'block' : 'none';
            }
        } else {
            // User is not logged in
            if (authButtons) authButtons.style.display = 'flex';
            if (userMenu) userMenu.style.display = 'none';

            // Hide Admin link
            const adminLink = document.getElementById('admin-dashboard-link') || document.querySelector('a[href="/admin"]');
            if (adminLink) {
                const li = adminLink.closest('li');
                if (li) li.style.display = 'none';
                else adminLink.style.display = 'none';
            }
        }
    },

    // Initialize on page load
    init() {
        this.updateUI();
    }
};

// Initialize auth on page load
document.addEventListener('DOMContentLoaded', () => {
    auth.init();
});
