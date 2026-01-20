import React, { useState, useEffect,useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../apiconfig/api";

const AdminEdit = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [imagesActual, setImagenesActuales] = useState([]);
    const [imagenesConservar, setImagenesConservar] = useState([]);
    const [imagenesNuevas, setImagenesNuevas] = useState([]);
    const [previewImages, setPreviewImages] = useState([]);
    const [type, setType] = useState("");
    const [discount, setDiscount] = useState(0);
    const [error, setError] = useState("");
    const [selecteTypes, setSelectedTypes] = useState([]);
    const [selecteCategory, setSelectedCategory] = useState([]);
    const reference = useRef(null);
    const reference2 = useRef(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        handleGetProduct();
        handleGetTypes();
        handleGetCategory();
    }, []);

     useEffect(() => {
          if (error) {
              const timer = setTimeout(() => {
                  setError("");
              }, 5000); // 5000ms = 5 segundos
  
              return () => clearTimeout(timer); // Limpia el temporizador si el error cambia
          }
      }, [error]); // Se ejecuta cada vez que el error cambia

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if(discount < 0 || discount > 100 || isNaN(discount)) {
            setError("El descuento debe estar entre 0 y 100.");
            return;
        }
        const formData = new FormData();
        formData.append("name", name);
        formData.append("description", description);
        formData.append("price", price);
        formData.append("stock", stock);
        formData.append("category", category);

        for(const file of imagenesConservar) {
            formData.append("imagenesConservar", file);
        }
        for(const file of imagenesNuevas) {
            formData.append("images", file);
        }

        formData.append("type", type);
        formData.append("discount", discount);
        try {
            await api.patch(`/products/${id}`,formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            navigate("/admin");
        } catch (error) {
            if (error.response) {
                console.error("Detalles del error:", error.response.data);
                const errorMessage = error.response.data.message || "Error desconocido";

                if (error.response.status === 400) {
                    setError(errorMessage);
                } else if (error.response.status === 404) {
                    if (errorMessage.toLowerCase().includes("categoría")) {
                        setError("Error: La categoría seleccionada no existe.");
                    } else if (errorMessage.toLowerCase().includes("tipo")) {
                        setError("Error: El tipo seleccionado no existe.");
                    } else {
                        setError("Error: Producto, categoría o tipo no encontrados.");
                    }
                } else if (error.response.status === 500) {
                    setError("Error del servidor. Inténtalo nuevamente más tarde.");
                } else {
                    setError(errorMessage);
                }
            } else {
                console.error("Error de conexión:", error.message);
                setError("Hubo un problema con la conexión al servidor.");
            }
            // Desplazar la pantalla hacia arriba al mostrar el error
                window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    const handleGetProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setName(response.data.name);
            setDescription(response.data.description);
            setPrice(response.data.price);
            setCategory(response.data.category._id);
            setStock(response.data.stock);
            setImagenesActuales(response.data.images);
            setImagenesConservar(response.data.images);
            setType(response.data.type._id);
            setDiscount(response.data.discount);

        } catch (error) {
            console.error("Error al obtener el producto:", error);
        }
    };
    const handleGetTypes = async () => {
        try {
            const response = await api.get("/types/");
            setSelectedTypes(response.data);
        } catch (error) {
            console.error("Error al obtener los tipos:", error);
        }
    };

    const handleGetCategory = async () => {
        try {
            const response = await api.get("/categories/");
            setSelectedCategory(response.data);
        } catch (error) {
            console.error("Error al obtener las categorias:", error);
        }
    };

   const handleImageChange = (e) => {
     const files = Array.from(e.target.files);
     const totalImages = 5 - imagenesNuevas.length;

     // Función para mostrar error y limpiarlo


     // No permite agregar más imágenes si ya tienes 5
     if (totalImages <= 0) {
        setError("Solo se permiten 5 imágenes.");
        window.scrollTo({ top: 0, behavior: "smooth" });
        return;
     }

     const imagenesGuardar = files.slice(0, totalImages);
     const imagenesActualizadas = [...imagenesNuevas, ...imagenesGuardar];

     setImagenesNuevas(imagenesActualizadas);
     setPreviewImages(imagenesActualizadas.map((file) => URL.createObjectURL(file)));

     // Si se descartaron imágenes adicionales
     if (files.length > imagenesGuardar.length) {
        setError("Solo se permiten 5 imágenes, las restantes fueron descartadas.");
        window.scrollTo({ top: 0, behavior: "smooth" });
     }
    };

   const handleToggleImagen = (imagen) => {
       setImagenesConservar((prev)=> 
       prev.includes(imagen)
       ? prev.filter((img) => img !== imagen) // la elimina si ya estaba
       : [...prev, imagen] // la agrega si no estaba
       );
    };

    const deleteImage =(img) =>{
        setImagenesNuevas((prev)=> prev.filter((_, i) => i !== img));
        setPreviewImages((prev) => prev.filter((_, i) => i !== img));
        if(reference.current){
            reference.current.value = "";
        }
    }
  const nexImg = () => {
      setSelectedImage((prev) =>
        prev === imagenesNuevas.length - 1 ? 0 : prev + 1
      );
  };

  const prevImg = () => {
      setSelectedImage((prev) =>
        prev === 0 ? imagenesNuevas.length - 1 : prev - 1
      );
  };

  useEffect(()=>{
     const handledDispar =(e)=>{
        if(reference2.current && !reference2.current.contains(e.target)){
            setSelectedImage(null);
        }
     }

         document.addEventListener("mousedown", handledDispar);
        return () => {
            document.removeEventListener("mousedown", handledDispar);
        };
  
  
       },[])
    return (
       
            <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 w-full max-w-lg">
                    <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-5">
                        Actualizar Producto
                    </h1>

                    
                    {error && (
                        <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-center">
                            {error}
                        </div>
                    )}

                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {/* Nombre */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">Nombre:</label>
                            <input
                                type="text"
                                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        {/* Descripción */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">Descripción:</label>
                            <textarea
                                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                rows="3"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>

                        {/* Precio */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">Precio:</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                required
                            />
                        </div>

                        {/* Stock */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">Existencias:</label>
                            <input
                                type="number"
                                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={stock}
                                onChange={(e) => setStock(e.target.value)}
                                required
                            />
                        </div>

                        {/* Categoría */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                Identificación de categoría:
                            </label>
                            <select
                                value={category}
                                onChange={(event) => setCategory(event.target.value)}
                                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                <option value="">Todos las categorías</option>
                                {selecteCategory.map((category) => (
                                    <option key={category._id} value={category._id}>
                                    {category.name}
                                    </option>
                                ))}
                                </select>
                        </div>

                        {/* Tipo */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                Tipo de identificación:
                            </label>
                            <select
                                value={type}
                                onChange={(event) => setType(event.target.value)}
                                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                >
                                <option value="">Todos los tipos</option>
                                {selecteTypes.map((tipo) => (
                                    <option key={tipo._id} value={tipo._id}>
                                    {tipo.name}
                                    </option>
                                ))}
                                </select>
                        </div>
                      {/* Imagenes */}
                    {imagesActual.length > 0 && (
                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-900 dark:text-white mb-2">
                            Imágenes actuales:
                            </label>

                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {imagesActual.map((image, index) => (
                                <div
                                key={index}
                                className="relative p-2 border rounded-lg shadow-sm bg-white dark:bg-gray-800"
                                >
                                {/* Checkbox */}
                                <input
                                    type="checkbox"
                                    checked={imagenesConservar.includes(image)}
                                    onChange={() => handleToggleImagen(image)}
                                    className="absolute top-2 left-2 w-5 h-5 accent-blue-600"
                                />

                                {/* Imagen */}
                                <img
                                    src={`http://localhost:5000/${image}`}
                                    alt={`Imagen ${index}`}
                                    className="w-full h-32 object-cover rounded-md"
                                />

                                {/* Nombre / pie de foto */}
                                <p className="text-xs text-center mt-2 text-gray-700 dark:text-gray-300 truncate">
                                    {image}
                                </p>
                                </div>
                            ))}
                            </div>
                        </div>
                        )}


                        <div className="mt-4">
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">
                                Imágenes nuevas:
                            </label>

                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white mt-1"
                                onChange={handleImageChange}
                                ref={reference}
                            />

                            {previewImages.length > 0 && (
                                <div className="mt-3 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                    {previewImages.map((image, index) => (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center p-3 border rounded-lg bg-gray-100 dark:bg-gray-800 shadow"
                                    >
                                        <img
                                        src={image}
                                        alt={`Preview ${index}`}
                                        className="w-28 h-28 object-cover rounded-md mb-2"
                                        onClick={()=> setSelectedImage(index)}
                                        />

                                        <button
                                        type="button"
                                        onClick={() => deleteImage(index)}
                                        className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-1 px-3 rounded-lg transition"
                                        >
                                        Eliminar
                                        </button>
                                    </div>
                                    ))}
                                </div>
                                )}

                        </div>

                        {selectedImage !== null && (
                            <div ref={reference2} key={previewImages.length} className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50">
                             {previewImages.length > 1 &&(
                                // Botón anterior 
                                <button
                                    type="button"
                                    className="absolute left-4 text-white text-4xl"
                                    onClick={prevImg}
                                > 
                                    &lt;
                                </button>
                                 )} 
                                {/* Imagen ampliada */}
                                <img
                                    src={previewImages[selectedImage]}
                                    className="max-w-[90%] max-h-[90%] rounded-lg shadow-2xl"
                                    alt="Imagen ampliada"
                                />
                             {previewImages.length > 1 &&(
                                 
                             
                                // Botón siguiente 
                                <button
                                    type="button"
                                    className="absolute right-4 text-white text-4xl"
                                    onClick={nexImg}
                                >
                                    &gt;
                                </button>
                             )}

                                {/* Botón cerrar */}
                                <button
                                    type="button"
                                    className="absolute top-4 right-4 text-white text-3xl"
                                    onClick={() => setSelectedImage(null)}
                                >
                                    &times;
                                </button>
                            </div>
                        )}


                        {/* Descuento */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">Descuento:</label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                value={discount}
                                onChange={(e) => setDiscount(Math.max(0, Math.min(100, parseInt(e.target.value))))}
                                required
                            />
                        </div>

                        {/* Botón */}
                        <button
                            type="submit"
                            className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
                        >
                            Actualizar
                        </button>
                    </form>
                </div>
            </div>
        
    );
};

export default AdminEdit;
