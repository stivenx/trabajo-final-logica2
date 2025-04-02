import React, { useEffect, useState } from "react";
import api from '../apiconfig/api';




const CategoryList = () => {
    
   
    const [categorys, setCategory] = React.useState([]);
    const [response, setResponse] = useState('');

   const handleDelete = async (categoryId) => {
       try {
           const response = await api.delete(`/categories/${categoryId}`);
           if (response.status === 200) {
               setCategory(categorys.filter((category) => category._id !== categoryId));
               setResponse('✅ La categoría se ha eliminado correctamente');
                window.scrollTo({ top: 0, behavior: "smooth" });

                setTimeout(() => {
                    setResponse("");
                }, 5000);
           } else {
               console.error('Error al eliminar la categoría:', response.data);
           }
       } catch (error) {
           console.error('Error al eliminar la categoría:', error);
       }
   };
   

   
   
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await api.get('/categories');
                setCategory(response.data);
                
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };

        fetchCategories();
    }, []);

    return (
        <div class="relative overflow-x-auto shadow-md ">
            <div class="flex justify-between items-center px-4 py-2 bg-primary-100 dark:bg-primary-800">
                <h2 class="text-xl font-semibold text-primary-900 dark:text-white">
                    Categorys</h2>
                 
                 {/* Mensaje de éxito */}
                {response && (
                    <div className="mt-3 p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg dark:bg-green-900 dark:text-green-300 dark:border-green-500 text-center transition-colors duration-300">
                        {response}
                    </div>
                )}
               
                <a href="/categoryList/create" class="px-4 py-2 bg-primary-700 text-white
                hover:bg-primary-600">
                    Add Category
                </a>

              
            </div>
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            categoryId
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Description
                        </th>
                      
                        <th scope="col" class="px-6 py-3">
                            Edit
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Delete
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {categorys.map((category) => (
                        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {category._id}
                            </td>
                            <td class="px-6 py-4">
                                {category.name}
                            </td>
                            
                            <td class="px-6 py-4">
                                {category.description}
                            </td>
        
                            <td class="px-6 py-4">
                                <a href={`/categoryList/edit/${category._id}`} class="font-medium text-primary-500 hover:underline">
                                ✏️ Edit</a>
                            </td>
                            <td class="px-6 py-4">
                                <a style={{cursor: "pointer"}} onClick={() => handleDelete(category._id)} class="font-medium text-red-500 hover:underline">
                                🗑 Delete</a>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}


export default CategoryList;