import { useContext, useEffect, useState,useRef } from "react";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/AuthContext";

export default function CartModal() {
    const { cart, isCartOpen, toggleCart, removeFromCart, updateItemQuantity, fetchCart,clearCart } = useContext(CartContext);
    const { userId } = useContext(AuthContext);
    const [cartLoading, setCartLoading] = useState(true);
    const modalRef = useRef(null);
    

  useEffect(() => {
          if (userId) {
              fetchCart(userId).finally(() => setCartLoading(false));
          } else {
              setCartLoading(false);
          }
    }, [userId]);

   
    useEffect(()=>{
        const handleOnclick=(e)=>{
            if(modalRef.current && !modalRef.current.contains(e.target)){
                toggleCart();
            }
        }
        if(isCartOpen){
         document.addEventListener("mousedown",handleOnclick)
        }
        
        return ()=>{
            document.removeEventListener("mousedown",handleOnclick)
        }

    },[isCartOpen,toggleCart])
    if (!isCartOpen) return null;

    // 🛒 Calcular total del carrito
    const totalCarrito = cart.reduce((total, item) => {
        const discount = item.product.discount ?? 0;
        const finalPrice = item.product.price - (item.product.price * (discount / 100)); 
        return total + finalPrice * item.quantity;
    }, 0);

    return (
        <div  className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div ref={modalRef}  className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">🛒 Carrito de Compras</h2>
                    <button onClick={toggleCart} className="text-gray-500 hover:text-gray-700">✖️</button>
                </div>

                {cartLoading ? (
                    <p>Cargando carrito...</p>
                ) : cart.length === 0 ? (
                    <p className="text-gray-600">Tu carrito está vacío.</p>
                ) : (
                    <div>
                        {cart.map((item) => {
                            const discountPercentage = item.product.discount ?? 0;
                            const finalPrice = item.product.price - (item.product.price * (discountPercentage / 100));

                            return (
                                <div key={item.product._id + item.quantity } className="flex items-center gap-4 p-2 border-b">
                                    {/* 📸 Imagen del producto */}
                                    <img 
                                        src={`http://localhost:5000/${item.product.images[0]}`} 
                                        alt={item.product.name} 
                                        className="w-16 h-16 object-cover rounded-md"
                                    />
                                    
                                    {/* 📌 Detalles del producto */}
                                    <div className="flex-1">
                                        <h3 className="text-sm font-semibold">{item.product.name}</h3>
                                        
                                        {/* 🔹 Controles de cantidad */}
                                        <div className="flex items-center gap-2">
                                            <button 
                                                 onClick={() =>{  updateItemQuantity(userId, item.product._id, item.quantity - 1);fetchCart(userId)}}
                                                 disabled={item.quantity <= 1}
                                                className="px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                                            >
                                                -
                                            </button>
                                            <span className="font-bold">{item.quantity}</span>
                                            <button 
                                                onClick={() =>{ updateItemQuantity(userId, item.product._id, item.quantity + 1);fetchCart(userId)}}

                                                disabled={item.quantity >= (item.product.stock + item.quantity)} // 🔥 Nueva validación
                                                className="px-2 py-1 bg-gray-200 rounded-md text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                                            >
                                                +
                                            </button>
                                        </div>

                                        {/* 🔥 Precio con descuento */}
                                        {discountPercentage > 0 ? (
                                            <p className="text-xs text-red-500">-{discountPercentage}% OFF</p>
                                        ) : null}
                                        <p className="text-sm text-gray-600">
                                            <span className="font-bold text-green-600">
                                                ${finalPrice.toFixed(2)} x {item.quantity}
                                            </span>
                                        </p>
                                    </div>
                                    
                                    {/* 🗑️ Botón de eliminar */}
                                    <button
                                       onClick={() => removeFromCart(userId, item.product._id)}
                                        className="text-red-600 hover:text-red-800"
                                    >
                                        ❌
                                    </button>
                                </div>
                            );
                        })}

                        {/* 🔹 Total del carrito */}
                        <div key={totalCarrito} className="text-right mt-4 p-2 bg-gray-100 rounded-lg">
                            <h3 className="text-lg font-bold text-gray-900">Total:</h3>
                            <p className="text-green-700 font-bold">${totalCarrito.toFixed(2)}</p>
                        </div>
                        {/* 🗑️ Botón de vaciar carrito */}
                        <button 
                            onClick={() => clearCart(userId)}
                            className="mt-4 w-full bg-red-600 text-white font-bold py-2 rounded-lg hover:bg-red-700"
                        >
                            Vaciar Carrito
                        </button>
                        {/* 🛍️ Botón de ir al checkout */}
                        <button 
                            onClick={() => alert("Redirigiendo a pago...")}
                            className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded-lg hover:bg-blue-700"
                        >
                            Finalizar Compra
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
