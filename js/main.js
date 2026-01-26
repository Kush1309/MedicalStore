// Cart Management
const cart = {
    items: [],

    init() {
        this.load();
        this.updateCartBadge();
    },

    load() {
        const saved = localStorage.getItem('cart');
        if (saved) {
            this.items = JSON.parse(saved);
        }
    },

    save() {
        localStorage.setItem('cart', JSON.stringify(this.items));
        this.updateCartBadge();
    },

    add(medicine, quantity = 1) {
        const existing = this.items.find(item => item.medicine._id === medicine._id);

        if (existing) {
            existing.quantity += quantity;
        } else {
            this.items.push({
                medicine,
                quantity
            });
        }

        this.save();
        this.showNotification(`${medicine.name} added to cart!`, 'success');
    },

    remove(medicineId) {
        this.items = this.items.filter(item => item.medicine._id !== medicineId);
        this.save();
    },

    updateQuantity(medicineId, quantity) {
        const item = this.items.find(item => item.medicine._id === medicineId);
        if (item) {
            item.quantity = quantity;
            if (item.quantity <= 0) {
                this.remove(medicineId);
            } else {
                this.save();
            }
        }
    },

    clear() {
        this.items = [];
        this.save();
    },

    getTotal() {
        return this.items.reduce((total, item) => total + (item.medicine.price * item.quantity), 0);
    },

    getCount() {
        return this.items.reduce((count, item) => count + item.quantity, 0);
    },

    updateCartBadge() {
        const badge = document.getElementById('cart-count');
        if (badge) {
            const count = this.getCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'block' : 'none';
        }
    },

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        notification.style.position = 'fixed';
        notification.style.top = '100px';
        notification.style.right = '20px';
        notification.style.zIndex = '9999';
        notification.style.minWidth = '300px';
        notification.style.animation = 'fadeIn 0.3s ease';

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'fadeOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
};

// Add to cart function (global)
async function addToCart(medicineId) {
    try {
        const medicine = await api.getMedicine(medicineId);
        cart.add(medicine);
    } catch (error) {
        console.error('Error adding to cart:', error);
        cart.showNotification('Failed to add item to cart', 'error');
    }
}

// Initialize cart on page load
document.addEventListener('DOMContentLoaded', () => {
    cart.init();
});

// Add fadeOut animation
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    from { opacity: 1; transform: translateX(0); }
    to { opacity: 0; transform: translateX(20px); }
  }
`;
document.head.appendChild(style);
