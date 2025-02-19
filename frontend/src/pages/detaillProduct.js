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
    const { addToCart } = useContext(CartContext);
    const { userId } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        handleGetProduct();
    }, []);

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
    
        try {
            if (quantity > product.stock) {
                alert("La cantidad solicitada supera el stock disponible.");
                return;
            }
            if (quantity <= 0) {
                alert("La cantidad debe ser mayor a cero.");
                return;
            }
            await addToCart(userId, product, quantity); // Espera que la acción se complete
            navigate("/cart"); // Ahora redirige con seguridad
        } catch (error) {
            console.error("Error al agregar producto al carrito:", error);
        }
    };
    

    if (!product) return <p>Cargando...</p>;

    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16 min-h-screen flex items-center">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row -mx-4">
                    <div className="md:flex-1 px-4">
                        <img className="w-full h-[600px] object-contain rounded-lg bg-white dark:bg-black" src={product.image} alt={product.name} />
                    </div>
                    <div className="md:flex-1 px-4">
                        <h2 className="text-6xl font-bold text-gray-800 dark:text-white mb-2">{product.name}</h2>
                        <p className="text-gray-600 dark:text-gray-300 text-2xl">{product.description}</p>
                        <div className="flex flex-col my-4">
                            <span className="font-bold text-gray-700 dark:text-gray-300">Precio: ${product.price}</span>
                            <span className="font-bold text-gray-700 dark:text-gray-300">Stock: {product.stock}</span>
                            <span className="font-bold text-gray-700 dark:text-gray-300">Categoría: {product.category.name}</span>
                            <span className="font-bold text-gray-700 dark:text-gray-300">Tipo: {product.type.name}</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <input 
                                type="number" 
                                min="1" 
                                max={product.stock} 
                                value={quantity} 
                                onChange={(e) => setQuantity(parseInt(e.target.value))}
                                className="w-20 p-2 border rounded-lg"
                            />
                            <button 
                            onClick={handleAddToCart}
                            className="w-full mt-4 bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700 text-2xl"
                        >
                            Add to Cart
                        </button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default DetaillProduct;

