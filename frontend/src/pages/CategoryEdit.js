import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../apiconfig/api';


const CategoryEdit = () => {

    //useAdminRedirect();

    
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
 
    const navigate = useNavigate();
    const { id } = useParams();


    useEffect(() => {
        
        handleGetProduct();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.put(`/categories/${id}`, {
                name,
                description,
               
            });
            console.log(response.data);
            navigate('/categoryList');
        } catch (error) {
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
                alert(`Error: ${error.response.data.message || 'Hubo un problema al actualizar el producto'}`);
            } else {
                console.error('Error al actualizar el producto:', error.message);
                alert('Hubo un problema al actualizar el producto');
            }
        }
    }

   

    const handleGetProduct = async () => {
        try {
            const response = await api.get(`/categories/${id}`);
            setName(response.data.name);
            setDescription(response.data.description);
    

        } catch (error) {
            console.error('Error al obtener el producto:', error);
        }
    };

    return (
        <div class="h-screen flex flex-col justify-center bg-gray-50 dark:bg-gray-800">
            <h1 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-5">
                Actualizar Producto
            </h1>
            <form class="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
                <div class="mb-5">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nombre:
                    </label>
                    <input type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                
                    <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Descripción:
                    </label>
                    <textarea id="description" rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Ingrese una descripción para el producto" value={description} onChange={(e) => setDescription(e.target.value)} required />
                
                <button type="submit" class="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-900">
                actualizar
                </button>
            </form>
        </div>
    );
}

export default  CategoryEdit;