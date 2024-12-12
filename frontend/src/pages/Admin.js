import React, { useEffect, useState } from "react";
import api from '../apiconfig/api';



const Admin = () => {
    
   
    const [products, setProducts] = React.useState([]);

   const handleDelete = async (productId) => {
       try {
           const response = await api.delete(`/products/${productId}`);
           if (response.status === 200) {
               setProducts(products.filter((product) => product._id !== productId));
               alert('El producto se ha eliminado correctamente');
           } else {
               console.error('Error al eliminar el producto:', response.data);
           }
       } catch (error) {
           console.error('Error al eliminar el producto:', error);
       }
   };
   

   
   
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await api.get('/products');
                setProducts(response.data);
            } catch (error) {
                console.error('Error al obtener los productos:', error);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div class="relative overflow-x-auto shadow-md ">
            <div class="flex justify-between items-center px-4 py-2 bg-primary-100 dark:bg-primary-800">
                <h2 class="text-xl font-semibold text-primary-900 dark:text-white">
                    Products</h2>
               
                <a href="/users" class="px-4 py-2 bg-primary-700 text-white
                hover:bg-primary-600">
                    Users 
                </a>
                <a href="/categoryList" class="px-4 py-2 bg-primary-700 text-white
                hover:bg-primary-600">
                    Categories
                </a>
               
                <a href="/admin/Create" class="px-4 py-2 bg-primary-700 text-white
                hover:bg-primary-600">
                    Add product
                </a>

              
            </div>
            <table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
                <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                        <th scope="col" class="px-6 py-3">
                            Name
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Description
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Price
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Category
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Stock
                        </th>
                        <th scope="col" class="px-6 py-3">
                            Image
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
                    {products.map((product) => (
                        <tr class="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
                            <td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                {product.name}
                            </td>
                            <td class="px-6 py-4">
                                {product.description}
                            </td>
                            <td class="px-6 py-4 flex items-center space-x-2">
                                ${product.price} <span className="text-xs ml-1"> COL</span>
                            </td>
                            <td class="px-6 py-4">
                                {product.category.name}
                            </td>
                            <td class="px-6 py-4">
                                {product.stock}
                            </td>
                            <td class="px-6 py-4">
                                <img src={product.image} alt={product.name} className="w-10 h-10 object-cover rounded-full" />
                            </td>
                            <td class="px-6 py-4">
                                <a href={`admin/edit/${product._id}`} class="font-medium text-primary-500 hover:underline">
                                    Edit</a>
                            </td>
                            <td class="px-6 py-4">
                                <a style={{cursor: "pointer"}} onClick={() => handleDelete(product._id)} class="font-medium text-red-500 hover:underline">
                                    Delete</a>
                            </td>
                        </tr>
                    ))}

                </tbody>
            </table>
        </div>
    );
}


export default Admin