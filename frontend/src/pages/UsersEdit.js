import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../apiconfig/api';


const UserEdit = () => {

    //useAdminRedirect();

   
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [direction, setDirection] = useState('');

    const { id } = useParams();
    console.log('id:', id);
    console.log('ruta actual:', window.location.pathname);
    const navigate = useNavigate();
  

    
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
                alert(`Error: ${error.response.data.message || 'Hubo un problema al actualizar al usuario'}`);
            } else {
                console.error('Error al actualizar el usuario:', error.message);
                alert('Hubo un problema al actualizar el producto');
            }
        }
    }

   

    const handleGetUser = async () => {
        try {
            const response = await api.get(`/users/${id}`);
            console.log('Response:', response);
            console.log(response.data);
            setName(response.data.name);
            setEmail(response.data.email);
            
            setDirection(response.data.direction);
            
        } catch (error) {
            console.error('Error al obtener el usuario:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-6">
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-300 dark:border-gray-700 w-full max-w-lg">
                <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-5">
                    Actualizar Usuario
                </h1>



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

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">Email:</label>
                        <input
                            type="email"
                            className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    {/* Contraseña */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">Contraseña:</label>
                        <input
                            type="password"
                            className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    {/* Dirección */}
                    <div>
                        <label className="block text-sm font-medium text-gray-900 dark:text-white">Dirección:</label>
                        <input
                            type="text"
                            className="w-full p-2 border rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white"
                            value={direction}
                            onChange={(e) => setDirection(e.target.value)}
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
 

export default UserEdit;