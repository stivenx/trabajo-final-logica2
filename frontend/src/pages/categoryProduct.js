import React, { useState, useEffect } from "react";
import {  useParams } from "react-router-dom";
import api from "../apiconfig/api";
import ProductCard from "../components/ProductCard";

const CatagoryProduct = () => {

    
    const [products, setProductos] = useState([]);
    const [categoria, setCategoria] = useState({});
    const [error, setError] = useState("");
    const { id } = useParams("");
  
    useEffect(() => {
      const fetchProductos = async () => {
        try {
          const response = await api.get(`/products/category/${id}` );
          const categoria = await api.get(`/categories/${id}`);
          setCategoria(categoria.data);
          setProductos(response.data);
        } catch (error) {
          setError("Error al cargar los productos");
        }
      };
  
      fetchProductos();
    }, [])

    return (
        <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="flex flex-wrap items-center justify-center">
             <h1 className="w-full text-5xl font-bold text-center p-8 dark:text-white ">{categoria.name} </h1>
              {products.map((product) => (
                  <ProductCard key={product._id} product={product} className="shadow-md rounded-md" />
              ))}
          </div>
      </section>
    );
  
   
  
    
      
  
  };




export default CatagoryProduct ;