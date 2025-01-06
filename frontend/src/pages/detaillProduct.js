import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../apiconfig/api";



const DetaillProduct = () => {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState(0);
    const [category, setCategory] = useState('');
    const [type, setType] = useState('');
    const [stock, setStock] = useState(1);
    const [image, setImageUrl] = useState('');
    const navigate = useNavigate();
    const { id } = useParams();


    
    useEffect(() => {
        handleGetProduct();
    }, []);

    const handleGetProduct = async () => {
        try {
            const response = await api.get(`/products/${id}`);
            setName(response.data.name);
            setDescription(response.data.description);
            setPrice(response.data.price);
            setCategory(response.data.category.name);
            setType(response.data.type.name);
            setImageUrl(response.data.image);
        } catch (error) {
            console.error('Error al obtener el producto:', error);
        }
    };

    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16 min-h-screen flex items-center">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row -mx-4">
                        <div className="md:flex-1 px-4">
                            <div className="h-[600px] w-full rounded-lg bg-white dark:bg-black mb-4 flex items-center justify-center">
                                <img className="w-full h-full object-contain" src={image} alt="Product Image" />
                            </div>
                            <div className="flex justify-center mb-4">
                                <div className="w-full px-2">
                                    <button className="w-full bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-full font-bold hover:bg-gray-800 dark:hover:bg-gray-700 text-2xl">Add to Cart</button>
                                </div>
                               
                            </div>
                        </div>
                        <div className="md:flex-1 px-4">
                            <h2 className="text-6xl font-bold text-gray-800 dark:text-white mb-2">{name}</h2>
                            <div className="flex flex-col mb-4">
                                <div className="mr-4">
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Price: </span>
                                    <span className="text-gray-600 dark:text-gray-300">${price}</span>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Category: </span>
                                    <span className="text-gray-600 dark:text-gray-300">{category}</span>
                                </div>
                                <div>
                                    <span className="font-bold text-gray-700 dark:text-gray-300">Tipo: </span>
                                    <span className="text-gray-600 dark:text-gray-300">{type}</span>
                                </div>
                               
                            </div>
                            <p className="font-bold text-gray-700 dark:text-gray-300 text-2xl">Description:</p>
                            <p className="text-gray-600 dark:text-gray-300 text-2xl">{description}</p>
                            
                        </div>
                    </div>
                </div>

    

                

               
              
                

            
        </section>
        
     
        

        
    );
    
}



export default DetaillProduct;