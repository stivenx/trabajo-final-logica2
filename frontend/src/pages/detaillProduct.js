import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../apiconfig/api";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const DetaillProduct = () => {
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const { id } = useParams();
    const { addToCart,fetchCart,toggleCart,cart } = useContext(CartContext);
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetProduct(id);
    }, [id,cart]);

    const handleGetProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setProduct(response.data);
        } catch (error) {
            console.error('Error al obtener el producto:', error);
        }
    };

    const handleAddToCart = async () => {
        if (!userId) {
            alert("Debes iniciar sesión para agregar productos al carrito.");
            return;
        }

        if (quantity > product.stock) {
            alert("La cantidad solicitada supera el stock disponible.");
            return;
        }
        if (quantity <= 0) {
            alert("La cantidad debe ser mayor a cero.");
            return;
        }

        try {
            const response2 = await api.get(`/products/${id}`);
            const productUpdated = response2.data;
            
            await addToCart(userId, productUpdated, quantity);
            // Actualizar el estado del stock en el frontend inmediatamente
           await fetchCart(userId);

           const response = await api.get(`/products/${id}`);
           setProduct(response.data);

           setTimeout(() => {
                toggleCart();
            }, 100);

        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
        }
    };

    if (!product) return <p className="text-center text-lg font-semibold">Cargando...</p>;

    const discountPercentage = product.discount ?? 0;
    const finalPrice = product.price - (product.price * (discountPercentage / 100));

    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16 min-h-screen flex items-center">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                    
                    {/* Imagen del Producto */}
                    <div className="relative">
                        {/* Etiqueta de Descuento */}
                        {product.discount > 0 &&  (
                            <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg">
                                -{product.discount}% OFF
                            </div>
                        )}

                        {/* Cartel de Producto Agotado */}
                        {product.stock === 0 &&  (
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl">
                                <span className="text-white text-2xl font-bold bg-red-600 px-4 py-2 rounded-lg shadow-lg">
                                    🚫 Producto Agotado
                                </span>
                            </div>
                        )}

                        <img 
                            className="w-full h-[500px] object-contain rounded-xl bg-white dark:bg-gray-800 shadow-md" 
                            src={product.image} 
                            alt={product.name} 
                        />
                    </div>

                    {/* Información del Producto */}
                    <div>
                        <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-wide">
                            {product.name}
                        </h2>

                        <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">{product.description}</p>

                        {/* PRECIO */}
                        <div className="my-4">
                            {product.discount > 0  && product.stock > 0 ? (
                                <div className="flex flex-col">
                                    <span className="text-lg font-semibold text-gray-500 line-through">
                                        ${product.price} col
                                    </span>
                                    <span className="text-4xl font-extrabold text-green-600">
                                        ${finalPrice.toFixed(2)} col
                                    </span>
                                    <span className="text-sm font-semibold text-red-500 mt-1">
                                        ¡Ahorra ${product.price - finalPrice} col!
                                    </span>
                                </div>
                            ) : (
                                <span className="text-4xl font-extrabold text-gray-900 dark:text-white">
                                    ${product.price} col
                                </span>
                            )}
                        </div>

                        {/* INFORMACIÓN ADICIONAL */}
                        <div className="mt-4 text-lg">
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                Stock: <span className="text-gray-900 dark:text-white">{product.stock}</span>
                            </p>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                Categoría: <span className="text-gray-900 dark:text-white">{product.category.name}</span>
                            </p>
                            <p className="font-semibold text-gray-700 dark:text-gray-300">
                                Tipo: <span className="text-gray-900 dark:text-white">{product.type.name}</span>
                            </p>
                        </div>

                        {/* INPUT DE CANTIDAD Y BOTÓN */}
                        <div className="flex items-center gap-4 mt-6">
                            <input 
                                type="number" 
                                min="1" 
                                max={product.stock} 
                                value={quantity} 
                                onChange={(e) => {
                                    const value = parseInt(e.target.value);
                                    setQuantity(isNaN(value) ? 1 : Math.max(1, Math.min(product.stock, value)));
                                }}
                                className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-lg font-semibold"
                                disabled={product.stock === 0} // Deshabilitado si no hay stock
                            />

                            <button 
                                onClick={handleAddToCart}
                                className={`w-full text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out text-2xl
                                    ${product.stock === 0 ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800'}
                                `}
                                disabled={product.stock === 0} // Deshabilita el botón si el producto está agotado
                            >
                                {product.stock === 0 ? "❌ Sin Stock" : "🛒 Agregar al Carrito"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetaillProduct;