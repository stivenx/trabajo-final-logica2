import React, { useState, useEffect, useContext,useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../apiconfig/api";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/AuthContext";
import { TitlesContext } from "../context/titlesContext";
import { useNavigate } from "react-router-dom";

const DetaillProduct = () => {
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const { id } = useParams();
  const { addToCart, fetchCart, toggleCart, cart } = useContext(CartContext);
  const { userId } = useContext(AuthContext);
  const {setTitle} = useContext(TitlesContext);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [especifImageIndex, setEspecifImageIndex] = useState(null);
  const imageBigRef = useRef(null)
  const navigate = useNavigate();
  
  useEffect(() => {
    handleGetProduct();
    
  }, [id, cart]);

  const handleGetProduct = async () => {
    try {
      const response = await api.get(`/products/${id}`);
      setProduct(response.data);
      setTitle(`tienda tecnologica -${response.data.name}`)
    } catch (error) {
      console.error("Error al obtener el producto:", error);
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
      await fetchCart(userId);
      setQuantity(1);

      const response = await api.get(`/products/${id}`);
      setProduct(response.data);

      setTimeout(() => {
        toggleCart();
      }, 100);
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
    }
  };

  // -----------------------------------------------
  // SECCIÓN DE COMENTARIOS
  // -----------------------------------------------
  const [comentarios, setComentarios] = useState([]);
  const [comentario, setComentario] = useState("");
  const [rating, setRating] = useState(1);
  const [imagenesNuevas, setImagenesNuevas] = useState([]);
  const [preview, setPreview] = useState([]);
  const[imagenesActuales, setImagenesActuales] = useState([]);
  const [imagenesConservar,setImagenesConservar] = useState([])
  const [comentarioActualizar,setComentarioActualizar] = useState()
  const comentarioRef = useRef(null);
  const[falseRating , setFalseRating] = useState(null)
  const [flasePost , setFlasePost] = useState(null)
  const [bigimage, setBigImage] = useState(null);
  const [especifImagePos, setEspecifImagePos] = useState(null);

  useEffect(() => {
    if (id) obtenerComentarios();
  }, [id]);

  const obtenerComentarios = async () => {
    try {
      const res = await api.get(`/comentarios/${id}`);
      setComentarios(res.data);
    } catch (error) {
      console.error("Error al obtener comentarios:", error);
    }
  };

  const handleImagenesChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenesNuevas(files);
    setPreview(files.map((f) => URL.createObjectURL(f)));
  };
 
  const handleEliminarComentario = async (id) => {
    try {
      await api.delete(`/comentarios/${id}`);
      await obtenerComentarios();
    } catch (error) {
      console.error("Error al eliminar comentario:", error);
    }
  }
  const handleSubmitComentario = async (e) => {
    e.preventDefault();

    if (!comentario || !rating) {
      alert("Completa todos los campos y asigna una calificación.");
      return;
    }
    if(comentarioActualizar){
      const formData = new FormData();
      formData.append("product", id);
      formData.append("email", userId || "anonimo@correo.com");
      formData.append("comentario", comentario);
      formData.append("rating", rating);
      for(const imagen of imagenesConservar){
        formData.append("imagenesConservar", imagen);
      }
      for(const imagen of imagenesNuevas){
        formData.append("images", imagen);
      }
      try {
        await api.put(`/comentarios/${comentarioActualizar}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } catch (error) {
        console.error("Error al actualizar comentario:", error);
      }
    }else{
    const formData = new FormData();
    formData.append("product", id);
    formData.append("email", userId || "anonimo@correo.com");
    formData.append("comentario", comentario);
    formData.append("rating", rating);

    for (let i = 0; i < imagenesNuevas.length; i++) {
      formData.append("images", imagenesNuevas[i]);
    }

    try {
      await api.post("/comentarios/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    } catch (error) {
      console.error("Error al crear comentario:", error);
    }
  }
      // Limpiar y actualizar
      setComentario("");
      setRating(1);
      setImagenesNuevas([]);
      setPreview([]);
      setImagenesActuales([]);
      setImagenesConservar([]);
      comentarioRef.current.value="";
      await obtenerComentarios();
    
  };

  const handleEditarComentario =(comentario) =>{
    setComentario(comentario.comentario);
    setRating(comentario.rating);
    setImagenesConservar(comentario.images);
    setImagenesActuales(comentario.images);
    setComentarioActualizar(comentario._id)
  }

  const deletcontent =()=>{
    setComentario("");
    setPreview([]);
    setRating(1);
    setImagenesConservar([]);
    setComentarioActualizar(null);
    setImagenesActuales([])
    setImagenesNuevas([])
    if(comentarioRef.current){
      comentarioRef.current.value="";
    }
  }

  const imagesCamb =(imagen)=>{
    setImagenesConservar((prev)=>
    prev.includes(imagen)
    ? prev.filter((img) => img !== imagen) // la elimina si ya estaba
    : [...prev, imagen] // la agrega si no estaba
    );
  }
 const removePreview =(index)=>{
  setPreview((prev) => prev.filter(( _,i)=> i !== index))
  setImagenesNuevas((prev) => prev.filter(( _,i)=> i !== index))
  comentarioRef.current.value="";
 }

  {/*imagendetallada siguiente*/ }
   const nextImageBig = () => {
     setEspecifImageIndex((prev)=>
     (prev === product.images.length -1 ? 0 :prev+1)
    );
   }

   const prevImageBig = () => {
     setEspecifImageIndex((prev)=>
     (prev === 0 ? product.images.length -1 :prev-1)
    );
   }

   const nextImageBigComent = () => {
     setEspecifImagePos((prev)=>
     (prev === bigimage.images.length -1 ? 0 :prev+1)
    );
   }

   const prevImageBigComent = () => {
     setEspecifImagePos((prev)=>
     (prev === 0 ? bigimage.images.length -1 :prev-1)
    );
   }

   useEffect(() => {
  const handleImageBig = (e) => {
    if (imageBigRef.current && !imageBigRef.current.contains(e.target)) {
      setEspecifImageIndex(null);
    }
  };

  
 if(especifImageIndex !== null){
   document.addEventListener("mousedown", handleImageBig);
  }; 
  return () => {
    document.removeEventListener("mousedown", handleImageBig);
  };
}, [especifImageIndex]);

  if (!product)
    return <p className="text-center text-lg font-semibold">Cargando...</p>;

  const discountPercentage = product.discount ?? 0;
  const finalPrice =
    product.price - product.price * (discountPercentage / 100);

  const totalProducts = Math.min(product.stock, 5);

  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16 min-h-screen flex flex-col items-center">
      <div key={product.stock} className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div  className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          {/* Imagen del Producto */}
          <div className="relative flex gap-4 items-start">
  
            {/* Miniaturas a la izquierda */}
            {product.images.length > 1 && (
              <div className="flex flex-col gap-3">
                {product.images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5000/${image}`}
                    alt={product.name}
                    className={`
                      w-20 h-20 object-cover rounded-lg cursor-pointer transition
                      hover:scale-105 hover:shadow-lg
                      ${index ===(flasePost ?? currentImageIndex) ? "border-4 border-red-600 shadow-xl" : "border border-gray-400"}
                    `}
                    onClick={() => setCurrentImageIndex(index)}
                   /* onMouseEnter={() => setFlasePost(index)}
                    onMouseLeave={() => setFlasePost(null)}*/
                  />
                ))}
              </div>
            )}

            {/* Imagen grande */}
            <div className="relative flex-1">
              {product.discount > 0 && (
                <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-lg shadow-lg z-20">
                  -{product.discount}% OFF
                </div>
              )}

              {product.stock === 0 && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-xl z-20"  onClick={()=>setEspecifImageIndex(currentImageIndex)}>
                  < span className="text-white text-2xl font-bold bg-red-600 px-4 py-2 rounded-lg shadow-lg">
                    🚫 Producto Agotado
                  </span>
                </div>
              )}

              <img
                className="w-full h-[500px] object-contain rounded-xl bg-white dark:bg-gray-800 shadow-md"
                src={`http://localhost:5000/${product.images[flasePost ?? currentImageIndex]}`}
                alt={product.name}
                onClick={()=>setEspecifImageIndex(currentImageIndex)}
              />
            </div>

          </div>


          {/* Información del Producto */}
          <div>
            <h2 className="text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-wide">
              {product.name}
            </h2>

            <p className="text-gray-600 dark:text-gray-300 text-lg mb-4">
              {product.description}
            </p>

            <div className="my-4">
              {product.discount > 0 && product.stock > 0 ? (
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

            <div className="mt-4 text-lg">
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                Stock:{" "}
                <span className="text-gray-900 dark:text-white">
                  {product.stock}
                </span>
              </p>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                Categoría:{" "}
                <span className="text-gray-900 dark:text-white">
                  {product.category.name}
                </span>
              </p>
              <p className="font-semibold text-gray-700 dark:text-gray-300">
                Tipo:{" "}
                <span className="text-gray-900 dark:text-white">
                  {product.type.name}
                </span>
              </p>
            </div>
          
            <div className="flex items-center gap-4 mt-6">
              <input
                type="number"
                min="1"
                max={product.stock}
                value={product.stock === 0 ? 0 : quantity}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  setQuantity( 
                    
                    isNaN(value)
                      ? 1
                      : Math.max(1, Math.min(product.stock, value))
                  );
                }}
                className="w-20 p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center text-lg font-semibold"
                disabled={product.stock === 0}
              />

              <button
                onClick={handleAddToCart}
                className={`w-full text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 ease-in-out text-2xl
                ${
                  product.stock === 0
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
                }`}
                disabled={product.stock === 0}
              >
                {product.stock === 0 ? "❌ Sin Stock" : "🛒 Agregar al Carrito"}
              </button>
            </div>
          </div>
        </div>
       
      {especifImageIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
          
          {/* Contenedor principal con ref */}
          <div 
            ref={imageBigRef} 
            className="relative bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl max-w-3xl w-full flex flex-col items-center"
          >

            {/* Botón cerrar */}
            <button
              onClick={() => setEspecifImageIndex(null)}
              className="absolute -top-4 -right-4 text-white bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 text-xl shadow-lg"
            >
              ✕
            </button>

            {/* Imagen */}
            <img
              src={`http://localhost:5000/${product.images[especifImageIndex]}`}
              alt={product.name}
              className="max-h-[70vh] w-auto object-contain rounded-lg"
            />

            {/* Miniaturas — Corregido (product.images.length) */}
              {product.images.length > 1 && (
                <div className="flex gap-3 mt-6 flex-wrap justify-center">

                  {product.images.map((image, index) => (
                    <div key={index} className="cursor-pointer">
                      <img
                        src={`http://localhost:5000/${image}`}
                        alt={product.name}
                        className={`
                          w-20 h-20 object-cover rounded-lg border transition 
                          ${index === especifImageIndex 
                            ? "border-4 border-red-600 shadow-xl" 
                            : "border border-gray-400 hover:border-gray-600"}
                        `}
                        onClick={() => setEspecifImageIndex(index)}
                      />
                    </div>
                  ))}

                </div>
              )}

            {/* Flecha izquierda */}
            {product.images.length > 1 && (
              <button
                onClick={prevImageBig}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white p-3 rounded-full text-2xl"
              >
                ‹
              </button>
            )}

            {/* Flecha derecha */}
            {product.images.length > 1 && (
              <button
                onClick={nextImageBig}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white p-3 rounded-full text-2xl"
              >
                ›
              </button>
            )}

            {/* Indicador */}
            <div key={especifImageIndex} className="mt-4 text-gray-700 dark:text-gray-300">
              {especifImageIndex + 1} / {product.images.length}
            </div>

          </div>
        </div>
      )}



        {/* SECCIÓN DE COMENTARIOS */}
        <div className="mt-16 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg">
          <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">
            💬 Comentarios del producto
          </h3>
         { userId &&(
          //FORMULARIO//
          <form onSubmit={handleSubmitComentario} className="mb-8 space-y-4">
            <textarea
              placeholder="Escribe tu comentario..."
              value={comentario}
              onChange={(e) => setComentario(e.target.value)}
              className="w-full border p-2 rounded-md dark:bg-gray-700 dark:text-white"
              required
            />

            <div className="flex gap-2">
              <select value={rating}
              onChange={(e) => setRating(e.target.value)}>
                {[1, 2, 3, 4, 5].map((star) => (
                <option key={star} value={star} className={`cursor-pointer text-2xl ${
                    rating >= star ? "text-yellow-400" : "text-gray-400"
                  }`} >
                  {star} ⭐
                </option>
                ))}
              </select>
             
            </div>
               
            <input
              type="file"
              accept="image/*"
              ref={comentarioRef}
              multiple
              onChange={handleImagenesChange}
              className="block w-full text-sm text-gray-700 dark:text-gray-200"
            />
            {imagenesActuales.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    📸 Imágenes actuales
                  </h2>
                     <div className="flex gap-2 flex-wrap">
                        {imagenesActuales.map((src, i) => (
                          <div
                            key={i}
                            className="relative w-24 h-24 group"
                          >
                            <img
                              src={`http://localhost:5000/${src}`}
                              alt="Imagen actual"
                              className="w-full h-full object-cover rounded-lg border shadow-sm"
                            />

                            {/* Checkbox en esquina superior izquierda */}
                            <input
                              type="checkbox"
                              checked={imagenesConservar.includes(src)}
                              onChange={() => imagesCamb(src)}
                              className="absolute top-1 left-1 w-5 h-5 accent-blue-500 bg-white rounded-md cursor-pointer opacity-90 hover:opacity-100"
                              title="Conservar imagen"
                            />
                          </div>
                        ))}
                      </div>
                     </div>     
            )}
              

              {preview.length > 0 && (
                <div className="mt-4">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2">
                    🆕 Nuevas imágenes
                  </h2>
                 <div className="flex gap-3 flex-wrap">
                  {preview.map((src, i) => (
                    <div
                      key={i}
                      className="relative w-24 h-24"
                    >
                      <img
                        src={src}
                        alt={`Previsualización ${i + 1}`}
                        className="w-full h-full object-cover rounded-lg border shadow-sm transition-transform duration-200"
                      />
                      <button
                        type="button"
                        onClick={() => removePreview(i)}
                        className="absolute top-1 right-1 w-5 h-5 bg-red-500/80 hover:bg-red-600 text-white rounded-full flex items-center justify-center shadow-md transition"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>

                </div>
              )}
            <button
              type="submit"
              className="mt-3 bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700"
            >
              Enviar comentario
            </button>
            <button
              onClick={deletcontent}
              className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
            >
              Cancelar
            </button>

          </form>
         )}
          {/* LISTA DE COMENTARIOS */}
          {comentarios.length === 0 ? (
            <p className="text-gray-500">Aún no hay comentarios 😔</p>
          ) : (
            <div className="space-y-4">
              {comentarios.map((c, i) => (
                <div key={c.rating + c.comentario} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-gray-800 dark:text-white">
                      {c.email.email}
                    </span>
                    <span className="text-yellow-400">
                      {"★".repeat(c.rating)}{"☆".repeat(5 - c.rating)}
                    </span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-2">
                    {c.comentario}
                  </p>

                  {c.images && c.images.length > 0 && (
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {c.images.map((img, idx) => (
                        <img
                          key={idx}
                          src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                          alt="comentario"
                          className="w-24 h-24 object-cover rounded-lg border shadow-sm cursor-pointer"
                          onClick={()=>{setEspecifImagePos(idx);setBigImage(c)}}
                        />
                      ))}
                    </div>
                  )}
                  <p className="text-gray-500 text-sm mt-2">
                    {new Date(c.fechcreation).toLocaleString()}
                  </p>
                  {c.email._id === userId && (
                    <div className="flex gap-3 mt-3">
                      <button
                        onClick={() => handleEliminarComentario(c._id)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-md text-sm font-semibold transition"
                      >
                        🗑️ Eliminar
                      </button>
                      <button
                        onClick={() => handleEditarComentario(c)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-md text-sm font-semibold transition"
                      >
                        ✏️ Editar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

           {especifImagePos !== null && bigimage !== null && (
              <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-70">
                
                {/* Contenedor principal con ref */}
                <div 
                  ref={imageBigRef} 
                  className="relative bg-white dark:bg-gray-900 p-4 rounded-xl shadow-xl max-w-3xl w-full flex flex-col items-center"
                >

                  {/* Botón cerrar */}
                  <button
                    onClick={() =>{ setEspecifImagePos(null); setBigImage(null)}}
                    className="absolute -top-4 -right-4 text-white bg-black bg-opacity-70 hover:bg-opacity-90 rounded-full p-3 text-xl shadow-lg"
                  >
                    ✕
                  </button>

                  {/* Imagen */}
                  <img
                    src={`http://localhost:5000/${bigimage.images[especifImagePos]}`}
                    alt={bigimage.name}
                    className="max-h-[70vh] w-auto object-contain rounded-lg"
                  />


                   {/* Miniaturas — Corregido (product.images.length) */}
                      {bigimage.images.length > 1 && (
                        <div className="flex gap-3 mt-6 flex-wrap justify-center">

                          {bigimage.images.map((image, index) => (
                            <div key={index} className="cursor-pointer">
                              <img
                                src={`http://localhost:5000/${image}`}
                                alt={bigimage.name}
                                className={`
                                  w-20 h-20 object-cover rounded-lg border transition 
                                  ${index === especifImagePos
                                    ? "border-4 border-blue-600 shadow-xl" 
                                    : "border border-gray-400 hover:border-gray-600"}
                                `}
                                onClick={() => setEspecifImagePos(index)}
                              />
                            </div>
                          ))}

                        </div>
                      )}


                  {/* Flecha izquierda */}
                  {bigimage.images.length > 1 && (
                    <button
                      onClick={prevImageBigComent}
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white p-3 rounded-full text-2xl"
                    >
                      ‹
                    </button>
                  )}

                  {/* Flecha derecha */}
                  {bigimage.images.length > 1 && (
                    <button
                      onClick={nextImageBigComent}
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-60 hover:bg-opacity-90 text-white p-3 rounded-full text-2xl"
                    >
                      ›
                    </button>
                  )}

                  {/* Indicador */}
                  <div key={especifImagePos} className="mt-4 text-gray-700 dark:text-gray-300">
                    {especifImagePos + 1} / {bigimage.images.length}
                  </div>

                </div>
              </div>
            )}

        </div>
      </div>
    </section>
  );
};

export default DetaillProduct;
/* <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className={`text-2xl transition-colors ${
                    star <= (hover || rating) ? "text-yellow-400" : "text-gray-400"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>*/ 


            /*{Array.from({length:5}, (_,index) =>(
                <button
                key={index}
                type="button"
                onClick={() => setRating(index + 1)}
                onMouseEnter={() => setFalseRating(index + 1)}
                onMouseLeave={() => setFalseRating(null)} 
                className={`text-2xl ${
                  (falseRating ?? rating) >= index + 1
                    ? "text-yellow-500"
                    : "text-gray-400"
                }`}
              >
                ★
              </button>
              ))}
              */

              /*
              const [zoom, setZoom] = useState(false);
                        const [position, setPosition] = useState({ x: 0, y: 0 });
                              <div
                className="relative overflow-hidden max-h-[70vh]"
                onMouseEnter={() => setZoom(true)}
                onMouseLeave={() => setZoom(false)}
                onMouseMove={(e) => {
                  const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
                  const x = ((e.clientX - left) / width) * 100;
                  const y = ((e.clientY - top) / height) * 100;
                  setPosition({ x, y });
                }}
              >
                <img
                  src={`http://localhost:5000/${product.images[especifImageIndex]}`}
                  alt={product.name}
                  className={`max-h-[70vh] w-auto object-contain rounded-lg transition-transform duration-200
                    ${zoom ? "scale-150" : "scale-100"}`}
                  style={{
                    transformOrigin: `${position.x}% ${position.y}%`,
                  }}
                />
              </div>

              
              
              
              
              */ 