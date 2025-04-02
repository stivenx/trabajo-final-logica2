import React, { useEffect, useState } from "react";
import api from '../apiconfig/api';



const Users = () => {
    //useAuthRedirect();
    //useAdminRedirect();
   
    const [users, setUsers] = React.useState([]);
    const [response, setResponse] = useState('');

   
   
   const handleDelete = async (userId) => {
    try {
        const response = await api.delete(`/users/${userId}`);
        if (response.status === 200) {
            setUsers(users.filter((user) => user._id !== userId));
            setResponse('✅ El usuario se ha eliminado correctamente');
                window.scrollTo({ top: 0, behavior: "smooth" });

                setTimeout(() => {
                    setResponse("");
                }, 5000);
            
        } else {
            console.error('Error al eliminar el producto:', response.data);
        }
    } catch (error) {
        console.error('Error al eliminar el producto:', error);
    }
 };
   
   
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await api.get('/users/');
                setUsers(response.data);
            } catch (error) {
                console.error('Error al obtener los usuarios:', error);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div className="relative overflow-x-auto shadow-md ">
            <div className="flex justify-between items-center px-4 py-2 bg-primary-100 dark:bg-primary-800">
                <h2 className="text-xl font-semibold text-primary-900 dark:text-white">
                    users</h2>           
                 {/* Mensaje de éxito */}
                {response && (
                    <div className="mt-3 p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg dark:bg-green-900 dark:text-green-300 dark:border-green-500 text-center transition-colors duration-300">
                        {response}
                    </div>
                )}
                <a href="" className="px-4 py-2 bg-primary-700 text-white
                hover:bg-primary-600">
                    Add user
                </a>

              
            </div>
            <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" className="px-6 py-3">
                            Nombre
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Email
                        </th>
                        <th scope="col" className="px-6 py-3">
                            direction
                        </th>
                        <th scope="col" className="px-6 py-3">
                            fecha de creacion
                        </th>
                      
                        <th scope="col" className="px-6 py-3">
                            Edit
                        </th>
                        <th scope="col" className="px-6 py-3">
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user) => (
                        <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {user.name}
                            </td>
                            <td className="px-6 py-4">
                                {user.email}
                            </td>
                            <td className="px-6 py-4">
                                {user.direction}
                            </td>
                            <td className="px-6 py-4">
                             {new Date(user.fechcreation).toLocaleDateString("es-ES", {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                               hour: "numeric",
                               minute: "numeric",
                               hour12: true
                               
                            })}
                            </td>

                            <td className="px-6 py-4">
                                <a href={`/users/Edit/${user._id}`} className="font-medium text-primary-500 hover:underline">
                                    Edit</a>
                            </td>
                            <td className="px-6 py-4">
                                <a style={{cursor: "pointer"}} onClick={() => handleDelete(user._id)} className="font-medium text-red-500 hover:underline">
                                    Delete</a>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}


export default Users