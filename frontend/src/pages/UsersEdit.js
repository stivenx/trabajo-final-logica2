import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../apiconfig/api';

const UserEdit = () => {

    //useAdminRedirect();

   
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [direction, setDirection] = useState('');

    const navigate = useNavigate();
    const { id } = useParams();

    
    useEffect(() => {
       
        handleGetUser();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.patch(`/users/${id}`, {
                name,
                email,
                password,
                direction
                
            });
            console.log(response.data);
            navigate('/users');
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

   

    const handleGetUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            setName(response.data.name);
            setEmail(response.data.email);
            
            setDirection(response.data.direction);
            
        } catch (error) {
            console.error('Error al obtener el producto:', error);
        }
    };

    return (
        <div class="h-screen flex flex-col justify-center bg-gray-50 dark:bg-gray-800">
            <h1 class="text-3xl font-bold text-center text-gray-900 dark:text-white mb-5">
                Actualizar usuario
            </h1>
            <form class="w-full max-w-md mx-auto" onSubmit={handleSubmit}>
                <div class="mb-5">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        nombre:
                    </label>
                    <input type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                
                
                <div class="mb-5">
                    <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        email:
                    </label>
                    <input type="text" id="price" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>

                
                <div class="mb-5">
                    <label for="price" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        password:
                    </label>
                    <input type="password" id="password" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={password} onChange={(e) => setPassword(e.target.value)} required />
                </div>
                <div class="mb-5">
                    <label for="name" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                        direccion:
                    </label>
                    <input type="text" id="name" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={direction} onChange={(e) => setDirection(e.target.value)} required />
                </div>


                
                <button type="submit" class="text-white bg-primary-500 hover:bg-primary-600 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-primary-700 dark:hover:bg-primary-800 dark:focus:ring-primary-900">
                actualizar
                </button>
            </form>
        </div>
    );
}

export default UserEdit;