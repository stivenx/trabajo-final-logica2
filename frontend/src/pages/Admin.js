import React, { useEffect, useState,useContext } from "react";
import api from '../apiconfig/api';
import { CartContext } from "../context/cartContext";

const Admin = () => {
    const [products, setProducts] = useState([]);
    const [response, setResponse] = useState("");
   const [search, setSearch] = useState("");
   const { cart} = useContext(CartContext);


  useEffect(() => {
      if (search.length >= 3) {
          searchfetchProducts(search);
      }else{
         fetchProducts();
      }

  },[cart,search]);
    const handleDelete = async (productId) => {
        try {
            const response = await api.delete(`/products/${productId}`);
            if (response.status === 200) {
                setProducts(products.filter((product) => product._id !== productId));
                setResponse('✅ El producto se ha eliminado correctamente');
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
        
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const response = await api.get('/products');
            setProducts(response.data);
        } catch (error) {
            console.error('Error al obtener los productos:', error);
        }
    };
   
    const searchfetchProducts = async (search) => {
        
        try {
          const response = await api.get(`/products/search/${search}`);
          setProducts(response.data);
        } catch (err) {
          
        } finally {
        
        }
      };

    return (
        <div className="relative overflow-x-auto shadow-md p-4 bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Encabezado */}
            <div className="bg-primary-100 dark:bg-primary-800 p-4 rounded-md transition-colors duration-300">
                <h2 className="text-2xl font-semibold text-primary-900 dark:text-white">
                    Products
                </h2>

                {/* Buscador */}
                <div className="mt-4">
                    <input
                        type="text"
                        placeholder="Buscar producto..."
                        className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white transition-colors duration-300"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {/* Mensaje de éxito */}
                {response && (
                    <div className="mt-3 p-3 text-sm text-green-700 bg-green-100 border border-green-400 rounded-lg dark:bg-green-900 dark:text-green-300 dark:border-green-500 text-center transition-colors duration-300">
                        {response}
                    </div>
                )}

                {/* Botones de navegación */}
                <div className="flex flex-wrap gap-2 mt-4">
                    <a href="/users" className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors duration-300">
                        👤 Users
                    </a>
                    <a href="/categoryList" className="px-4 py-2 bg-primary-700 text-white rounded-lg hover:bg-primary-600 dark:bg-primary-600 dark:hover:bg-primary-500 transition-colors duration-300">
                        📂 Categories
                    </a>
                    <a href="/admin/Create" className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-500 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300">
                        ➕ Add Product
                    </a>
                </div>
            </div>

            {/* Tabla de productos */}
            <table className="w-full text-sm text-left text-gray-700 dark:text-gray-300 mt-6 transition-colors duration-300">
                <thead className="text-xs uppercase bg-gray-100 dark:bg-gray-700 dark:text-gray-300 transition-colors duration-300">
                    <tr>
                        <th className="px-6 py-3">Name</th>
                        <th className="px-6 py-3">Description</th>
                        <th className="px-6 py-3">Price</th>
                        <th className="px-6 py-3">Category</th>
                        <th className="px-6 py-3">Tipo</th>
                        <th className="px-6 py-3">Stock</th>
                        <th className="px-6 py-3">Image</th>
                        <th className="px-6 py-3">Discount</th>
                        <th className="px-6 py-3">Edit</th>
                        <th className="px-6 py-3">Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {products.map((product) => (
                        <tr key={product._id} className="odd:bg-white even:bg-gray-50 odd:dark:bg-gray-800 even:dark:bg-gray-700 border-b dark:border-gray-600 transition-colors duration-300">
                            <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{product.name}</td>
                            <td className="px-6 py-4">{product.description}</td>
                            <td className="px-6 py-4">${product.price} <span className="text-xs ml-1">COL</span></td>
                            <td className="px-6 py-4">{product.category.name}</td>
                            <td className="px-6 py-4">{product.type.name}</td>
                            <td className="px-6 py-4">{product.stock}</td>
                            <td className="px-6 py-4">
                                <img src={`http://localhost:5000/${product.images[0]}`} alt={product.name} className={`w-10 h-10 object-cover rounded-full ${product.stock === 0 && "opacity-50" }`} />
                            </td>
                            <td className="px-6 py-4">{product.discount}%</td>
                            <td className="px-6 py-4">
                                <a href={`admin/edit/${product._id}`} className="font-medium text-blue-500 hover:underline dark:text-blue-400 transition-colors duration-300">
                                    ✏️ Edit
                                </a>
                            </td>
                            <td className="px-6 py-4">
                                <button
                                    onClick={() => handleDelete(product._id)}
                                    className="font-medium text-red-500 hover:underline dark:text-red-400 transition-colors duration-300"
                                >
                                    🗑 Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
