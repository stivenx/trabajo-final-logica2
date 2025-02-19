import React, { createContext, useState, useEffect, useContext } from "react";
import api from "../apiconfig/api";
import { AuthContext } from "../context/AuthContext";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { userId } = useContext(AuthContext);
    const [cart, setCart] = useState([]);
    const [cartid, setCartid] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchCart(userId);
        } else {
            setCart([]); // Vaciar el carrito si no hay usuario
        }
    }, [userId]);
    
    
    // Cargar el carrito desde el backend
    const fetchCart = async (userId) => {
        if (!userId) return;
        setLoading(true);
        try {
            const response = await api.get(`carts/${userId}`);
            setCart(response.data.cart.items);
            setCartid(response.data.cart._id);

        } catch (error) {
            console.error("Error al obtener el carrito", error);
        } finally {
            setLoading(false);
        }
    };

    // Agregar producto al carrito
    const addToCart = async (userId, product, quantity) => {
        if (!userId) {
            console.error("No hay usuario autenticado");
            return;
        }
        try {
            const response = await api.post(`carts/`, {
                user: userId,
                items: [{ product: product._id, quantity }],
            });
            setCart(response.data.cart.items);
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
        }
    };

    // Eliminar producto del carrito
    const removeFromCart = async (userId, productId) => {
        if (!userId) {
            console.error("No hay usuario autenticado");
            return;
        }
        try {
            const response = await api.delete(`carts/${userId}/${productId}`);
            if (response.status === 200) {
                fetchCart(userId);
            }
            
        } catch (error) {
            console.error("Error al eliminar producto del carrito", error);
        }
    };

    return (
        <CartContext.Provider value={{ cart, fetchCart, addToCart, removeFromCart, loading, cartid }}>
            {children}
        </CartContext.Provider>
    );
};
