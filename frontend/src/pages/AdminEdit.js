import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../apiconfig/api";

const AdminEdit = () => {
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [image, setImageUrl] = useState("");
    const [type, setType] = useState("");
    const [discount, setDiscount] = useState(0);
    const [error, setError] = useState("");
    const [selecteTypes, setSelectedTypes] = useState([]);
    const [selecteCategory, setSelectedCategory] = useState([]);

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

        try {
            await api.patch(`/products/${id}`, {
                name,
                description,
                price,
                stock,
                category,
                image,
                type,
                discount
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
            setImageUrl(response.data.image);
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

                        {/* Imagen */}
                        <div>
                            <label className="block text-sm font-medium text-gray-900 dark:text-white">URL de la imagen:</label>
                            <textarea
                                className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                                rows="4"
                                value={image}
                                onChange={(e) => setImageUrl(e.target.value)}
                                required
                            />
                        </div>

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
