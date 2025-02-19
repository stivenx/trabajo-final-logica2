import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/AuthContext"; // Asegúrate de importar AuthContext
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const { addToCart } = useContext(CartContext);
    const { userId } = useContext(AuthContext); // Obtener userId
    const navigate = useNavigate();

    const handleAddToCart = async() => {
        if (!userId) {
            alert("Debes iniciar sesión para agregar productos al carrito.");
            return;
        }
        try {
            
          await  addToCart(userId, product, 1); // Se envía userId y cantidad = 1
          navigate("/cart");
        } catch (error) {
            console.error("Error al agregar producto al carrito", error);
        }
       
       
    };

    return (
        <div className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-4 ml-4">
            <Link to={`/product/${product._id}`}>
                <img className="p-8 rounded-t-lg object-cover object-center mx-auto w-64 h-64" src={product.image} alt={product.name} />
            </Link>
            <div className="px-5 pb-5">
                <Link to={`/products/${product._id}`}>
                    <h5 className="text-lg font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
                </Link>
                <div className="flex flex-col">
                    <span className="text-sm font-bold text-black dark:text-white">{product.category.name}</span>
                    <span className="text-sm font-bold text-black dark:text-white">{product.type.name}</span>
                </div>
                <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">${product.price} col</span>
                    <button 
                        onClick={handleAddToCart} 
                        className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-2 py-1.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 ml-2"
                    >
                        Add to Cart
                    </button>
                    <Link to={`/product/${product._id}`} className="text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-2 py-1.5 text-center">
                        Ver producto
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ProductCard;

