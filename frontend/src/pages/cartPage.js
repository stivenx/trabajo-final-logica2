import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/AuthContext";

const CartPage = () => {
    const { userId } = useContext(AuthContext);
    const { cart, fetchCart, removeFromCart, loading, cartid } = useContext(CartContext);
    const [cartLoading, setCartLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchCart(userId).finally(() => setCartLoading(false));
        } else {
            setCartLoading(false);
        }
    }, [userId]);

    if (cartLoading) return <p className="text-gray-800 dark:text-gray-300">Cargando carrito...</p>;

    return (
        <div className="p-5 bg-gray-100 dark:bg-gray-900 min-h-screen transition-colors duration-300">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">🛒 Tu Carrito</h2>

            {/* Mostramos el ID del carrito si existe */}
            {cartid && (
                <p className="text-gray-600 dark:text-gray-400 font-bold">
                    ID del Carrito: <span className="font-mono">{cartid}</span>
                </p>
            )}

            {loading ? (
                <p className="text-gray-700 dark:text-gray-300">Cargando productos...</p>
            ) : cart.length === 0 ? (
                <p className="text-gray-700 dark:text-gray-300">El carrito está vacío</p>
            ) : (
                <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg p-5 transition-colors duration-300">
                    {cart.map((item) => (
                        <div
                            key={item.product._id}
                            className="flex items-center gap-4 p-4 border-b dark:border-gray-700 transition-colors duration-300"
                        >
                            {/* Imagen del producto */}
                            <img
                                src={item.product.image}
                                alt={item.product.name}
                                className="w-20 h-20 object-cover rounded-lg"
                            />
                            {/* Nombre y cantidad */}
                            <div className="flex-1">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                    {item.product.name}
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Cantidad: <span className="font-bold">{item.quantity.toLocaleString()}</span>
                                </p>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Total:{" "}
                                    <span className="font-bold">
                                        ${(item.product.price * item.quantity).toLocaleString()} COL
                                    </span>
                                </p>
                            </div>
                            {/* Botón de eliminar */}
                            <button
                                onClick={() => removeFromCart(userId, item.product._id)}
                                className="text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300 font-semibold px-3 py-1 rounded-md border border-red-500 dark:border-red-400 hover:bg-red-100 dark:hover:bg-red-900 transition-colors duration-300"
                            >
                                ❌ Eliminar
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CartPage;



