import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apiconfig/api';

const AdminCreate = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(1);
    const [category, setCategory] = useState('');
    const [image, setImageUrl] = useState('');
    const [stock, setStock] = useState(1);
    const [type, setTypes] = useState("");
    const [error, setError] = useState('');
    const [selecteTypes, setSelectedTypes] = useState([]);
    const [selecteCategory, setSelectedCategory] = useState([]);

    const navigate = useNavigate();
    useEffect(() => {
        handleGetTypes();
        handleGetCategory();
    })
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
    
        try {
            const response = await api.post('/products', {
                name,
                description,
                price,
                stock,
                category,
                image,
                type,
                discount: 0
            });
    
            console.log(response.data);
            navigate('/admin');
        } catch (error) {
            if (error.response) {
                console.error("Detalles del error:", error.response.data);
    
                const errorMessage = error.response.data.message || "Error desconocido";
    
                if (error.response.status === 400) {
                    setError(errorMessage);
                } else if (error.response.status === 404) {
                    if (errorMessage.includes("Categoría")) {
                        setError("Error: La categoría seleccionada no existe.");
                    } else if (errorMessage.includes("Tipo")) {
                        setError("Error: El tipo seleccionado no existe.");
                    } else {
                        setError("Error: Tipo o categoría no encontrados.");
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
    
    const handleGetTypes = async () => {
        try {
            const response = await api.get('/types');
            setSelectedTypes(response.data);
        } catch (error) {
            console.error("Error al obtener los tipos:", error);
        }
    };
    
    const handleGetCategory = async () => {
        try {
            const response = await api.get('/categories');
            setSelectedCategory(response.data);
        } catch (error) {
            console.error("Error al obtener las categorías:", error);
        }
    };
    
    return (
       
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-5">
                    Crear Producto
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
                                onChange={(event) => setTypes(event.target.value)}
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

                    {/* Botón */}
                    <button
                        type="submit"
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-lg transition"
                    >
                        Crear
                    </button>
                </form>
            </div>
        </div>
);
};
    
    

   

export default AdminCreate;

