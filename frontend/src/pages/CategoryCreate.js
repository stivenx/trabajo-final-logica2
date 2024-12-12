import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../apiconfig/api';

const CategoryCreate = () => {
    //useAdminRedirect();


    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
   
   
    const navigate = useNavigate();
   
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('/categories', {
                name,
                description,
                
               
            });
            console.log(response.data);
            navigate('/categoryList');
        } catch (error) {
            if (error.response) {
                console.error('Detalles del error:', error.response.data);
                alert(`Error: ${error.response.data.message || 'Hubo un problema al crear la categoria'}`);
            } else {
                console.error('Error al crear la categoria:', error.message);
                alert('Hubo un problema al crear la categoria');
            }
        }
    }

    return (
        <div class="h-screen flex flex-col justify-center bg-white dark:bg-gray-900">
            <h1 class="text-4xl font-semibold text-primary-900 dark:text-white text-center mb-8">
                Crear una nueva categoría 
            </h1>
            <form class="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
                <div class="mb-5">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Nombre:
                    </label>
                    <input type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div class="mb-5">
                    <label for="description" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        Descripción:
                    </label>
                    <textarea id="description" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500 h-20" value={description} onChange={(e) => setDescription(e.target.value)} required />
                </div>
             
                <button type="submit" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Crear
                </button>
            </form>
        </div>
    );


}

export default CategoryCreate;