import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const { addToCart,toggleCart,fetchCart } = useContext(CartContext);
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleAddToCart = async () => {
        if (!userId) {
            alert("Debes iniciar sesión para agregar productos al carrito.");
            return;
        }
        try {
            await addToCart(userId, product, 1);
            await fetchCart(userId);

             
            toggleCart();

            
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
        }
    };

    const discountPercentage = product.discount ?? 0;
    const finalPrice = product.price - (product.price * (discountPercentage / 100));

    return (
        <div className="relative w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 mb-4 ml-4 overflow-hidden">
           {product.stock > 0 && product.discount > 0 && (
            <div className="absolute top-3 right-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-lg shadow-lg">
                -{product.discount}% OFF
            </div>
            )}


            {/* 🔴 Cartel de AGOTADO con cambio dinámico de color */}
            {product.stock === 0 && (
                <div className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded-lg shadow-lg 
                    bg-gray-800 text-white dark:bg-white dark:text-black">
                    AGOTADO
                </div>
            )}

            <Link to={`/product/${product._id}`}>
                <img 
                    className={`p-8 rounded-t-lg object-cover object-center mx-auto w-64 h-64 transition-transform duration-300 hover:scale-105 ${
                        product.stock === 0 ? "opacity-50" : ""
                    }`} 
                    src={product.image} 
                    alt={product.name} 
                />
            </Link>

            <div className="px-5 pb-5">
                <Link to={`/products/${product._id}`}>
                    <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
                </Link>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-black dark:text-white">{product.category.name}</span>
                    <span className="text-sm font-bold text-black dark:text-white">{product.type.name}</span>
                </div>

                {/* Precios */}
                {product.discount > 0 && product.stock > 0 ? (
                    <div className="flex flex-col mt-2">
                        <span className="text-lg font-bold text-gray-900 dark:text-white line-through">${product.price} col</span>
                        <span className="text-xl font-bold text-green-600">${finalPrice} col</span>
                    </div>
                ) : (
                    <span className="text-lg font-bold text-gray-900 dark:text-white">${product.price} col</span>
                )}

                {/* Botones mejorados */}
                <div className="flex items-center justify-between mt-4">
                    {product.stock > 0 ? (
                        <button 
                            onClick={handleAddToCart} 
                            className="bg-gradient-to-r from-blue-500 to-blue-400 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:shadow-lg"
                        >
                            🛒 Add to Cart
                        </button>
                    ) : (
                        <button 
                            disabled 
                            className="bg-gray-400 text-white font-bold py-2 px-4 rounded-lg shadow-md cursor-not-allowed"
                        >
                            ❌ Sin stock
                        </button>
                    )}
                    
                    <Link 
                        to={`/product/${product._id}`} 
                        className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg shadow-md transition-transform duration-300 hover:scale-105 hover:bg-orange-600"
                    >
                        🔍 Ver producto
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;
