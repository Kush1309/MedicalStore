import React, { createContext, useContext, useState, useEffect } from 'react';
import { cartAPI } from '../services/api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState([]);
    const [loading, setLoading] = useState(true);
    const { isAuthenticated } = useAuth();

    // Load cart from server when authenticated, or localStorage when guest
    useEffect(() => {
        if (isAuthenticated) {
            fetchCart();
        } else {
            const savedCart = localStorage.getItem('cart');
            if (savedCart) {
                setCart(JSON.parse(savedCart));
            }
            setLoading(false);
        }
    }, [isAuthenticated]);

    // Sync guest cart to localStorage
    useEffect(() => {
        if (!isAuthenticated) {
            localStorage.setItem('cart', JSON.stringify(cart));
        }
    }, [cart, isAuthenticated]);

    const fetchCart = async () => {
        try {
            // Backend cart implementation required for authenticated users
            const response = await cartAPI.getCart();
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            // Fallback to simpler cart structure if backend sync fails or isn't implemented yet
        } finally {
            setLoading(false);
        }
    };

    const addToCart = async (medicine) => {
        // Check if item already exists
        const existingItem = cart.find(item => item._id === medicine._id);

        let newCart;
        if (existingItem) {
            newCart = cart.map(item =>
                item._id === medicine._id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
            );
        } else {
            newCart = [...cart, { ...medicine, quantity: 1 }];
        }

        setCart(newCart);

        if (isAuthenticated) {
            // Sync with backend - simplified for now
            // To do full sync, we'd call cartAPI.addToCart(medicine)
        }
    };

    const removeFromCart = (medicineId) => {
        setCart(cart.filter(item => item._id !== medicineId));
    };

    const updateQuantity = (medicineId, quantity) => {
        if (quantity < 1) {
            removeFromCart(medicineId);
            return;
        }

        setCart(cart.map(item =>
            item._id === medicineId ? { ...item, quantity } : item
        ));
    };

    const clearCart = () => {
        setCart([]);
        if (!isAuthenticated) {
            localStorage.removeItem('cart');
        }
    };

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    const value = {
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal,
        cartCount
    };

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
};
