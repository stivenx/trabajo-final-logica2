import React, { useContext, useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const ProductCard = ({ product }) => {
    const { addToCart,toggleCart,fetchCart } = useContext(CartContext);
    const { userId } = useContext(AuthContext);
    const [activeImage, setActiveImage] = useState({});
    const [productDetail, setProductDetail] = useState(null);
    const [postActive, setPostActive] = useState(null);
    const modalref = useRef(null);
    const navigate = useNavigate();
  /*
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalref.current && !modalref.current.contains(event.target)) {
                setProductDetail(null);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        }
    },[])*/

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
 
    const indexImage = activeImage[product._id] ?? 0;

    const nextImage = (productID, totalImage) => {
        setActiveImage(prev => ({
            ...prev,
            [productID]: (prev[productID] ?? 0) === totalImage ? 0 : (prev[productID] ?? 0) + 1
        }));
    };

    const prevImage = (productID, totalImage) => {
        setActiveImage(prev => ({
            ...prev,
            [productID]: (prev[productID] ?? 0) === 0 ? totalImage : (prev[productID] ?? 0) - 1
        }));
    }
    return (
        <div className="relative w-full max-w-sm bg-white border border-gray-200 rounded-xl shadow-lg dark:bg-gray-800 dark:border-gray-700 mb-4 ml-4 overflow-hidden">

           {/* Vista ampliada */}
           
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
          {product.images.length > 0 ? (
            <div className="relative w-full flex justify-center items-center">

                {/* Imagen */}
                <Link to={`/product/${product._id}`} className="z-10">
                    <img 
                        className={`p-8 rounded-t-lg object-cover object-center mx-auto w-64 h-64 transition-transform duration-300 hover:scale-105 ${
                            product.stock === 0 ? "opacity-50" : ""
                        }`}
                        src={`http://localhost:5000/${product.images[indexImage]}`}
                        alt={product.name}
                       /* onClick={(e)=>{
                            e.preventDefault();setProductDetail(product);setPostActive(indexImage)}}*/
                      
                       /* onMouseEnter={() => {
                            product.images.length > 1 &&(  
                                setActiveImage(prev => ({
                                ...prev,
                                [product._id]: indexImage + 1
                                }))
                            )
                        }}
                            onMouseLeave={() => {
                            product.images.length > 1 &&(  
                                setActiveImage(prev => ({
                                ...prev,
                                [product._id]: 0
                                }))
                            )
                            }
                            } */

                    />
                </Link>

                {/* Botón anterior */}
                {product.images.length > 1 && (
                    <button
                        type="button"
                        className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 
                                text-white text-2xl px-2 py-1 rounded-full z-20"
                        onClick={() => prevImage(product._id, product.images.length - 1)}
                    >
                        ‹
                    </button>
                )}

                {/* Botón siguiente */}
                {product.images.length > 1 && (
                    <button
                        type="button"
                        className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 
                                text-white text-2xl px-2 py-1 rounded-full z-20"
                        onClick={() => nextImage(product._id, product.images.length - 1)}
                    >
                        ›
                    </button>
                )}

                {/* Indicadores (esferitas) */}
                {product.images.length > 1 && (
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                        {product.images.map((_, index) => (
                            <button
                                key={index}
                                className={`w-3 h-3 rounded-full transition 
                                    border border-gray-700 dark:border-white
                                    ${index === indexImage 
                                        ? "bg-gray-700 dark:bg-white" 
                                        : "bg-gray-400 dark:bg-white/40" 
                                    }`}
                                onClick={(e) => {
                                    e.preventDefault();
                                    setActiveImage(prev => ({
                                        ...prev,
                                        [product._id]: index
                                    }));
                                }}
                                /*
                                onMouseEnter={(e) => {
                                    e.preventDefault();
                                    setActiveImage(prev => ({
                                        ...prev,
                                        [product._id]: index
                                    }));
                                }}
                                onMouseLeave={(e) => {
                                    e.preventDefault();
                                    setActiveImage(prev => ({
                                        ...prev,
                                        [product._id]: indexImage
                                    }));
                                }}*/
                            />
                        ))}
                    </div>
                )}

            </div>
        ) : (
            <div className="relative w-full flex justify-center items-center">
                <Link to={`/product/${product._id}`}>
                    <img 
                        className="p-8 rounded-t-lg object-cover object-center mx-auto w-64 h-64"
                        src={`http://localhost:5000/${product.images[0]}`}
                        alt={product.name}
                    />
                </Link>
            </div>
        )}


           
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
/*
 {productDetail && (
            <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center">
                
                <div ref={modalref} className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full mx-6 overflow-hidden">
                
                {/* Botón cerrar /}
                <button
                    onClick={() => setProductDetail(null)}
                    className="absolute top-3 right-3 text-2xl text-white bg-black/50 w-10 h-10 rounded-full flex items-center justify-center hover:bg-black/70"
                >
                    ✕
                </button>

                {/* Imagen grande /}
                <img
                    src={`http://localhost:5000/${productDetail.images[postActive].replace(/\\/g, "/")}`}
                    alt="Vista ampliada"
                    className="w-full max-h-[80vh] object-contain bg-black"
                />

                {/* Controles /}
                {productDetail.images.length > 1 && (
                    <div className="flex justify-center gap-3 p-4 bg-gray-100">
                    {productDetail.images.map((image, index) => (
                        <img
                        key={index}
                        src={`http://localhost:5000/${image.replace(/\\/g, "/")}`}
                        alt={`Imagen ${index + 1}`}
                        onClick={()=>setPostActive(index)}
                        className={`w-20 h-20 object-contain cursor-pointer ${
                            index === postActive ? "border-2 border-blue-500" : ""
                        }`}
                        onMouseEnter={()=>setPostActive(index)}
                        onMouseLeave={()=>setPostActive(postActive)}
                        />
                    ))}
                    </div>
                )}
                </div>
            </div>
            )}*/ 