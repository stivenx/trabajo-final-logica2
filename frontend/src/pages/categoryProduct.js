import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import api from "../apiconfig/api";
import ProductCard from "../components/ProductCard";
const { CartContext } = require("../context/cartContext");


const CatagoryProduct = () => {
  const [products, setProducts] = useState([]);
  const [category, setCategory] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams(); // Obtiene el ID de la categoría desde la URL
  const [types, setTypes] = useState([]);
  const [selectedType, setSelectedType] = useState("");
  const { cart } = useContext(CartContext);

  // Fetch de productos y categorías
  useEffect(() => {
    
    const fetchTypes = async () => {
      try {
        const response = await api.get(`/types/`);
        setTypes(response.data);
      } catch (error) {
        setError("Error al cargar los tipos");
      }
    };
    fetchProductos();
    fetchTypes();

  }, [id,cart]);
  const fetchProductos = async () => {
    try {
      const response = await api.get(`/products/category/${id}`);
      const categoria = await api.get(`/categories/${id}`);
      setCategory(categoria.data);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar los productos");
    }
  };

  // Fetch de productos por tipo y categoría
  useEffect(() => {
    if (selectedType) {
      fetchProductsByCategoryAndType(id, selectedType);
    } else {
      fetchProductos()
    }
  }, [id, selectedType]);

  // Obtener productos por categoría
 

  // Obtener productos por categoría y tipo
  const fetchProductsByCategoryAndType = async (categoryId, typeId) => {
    try {
      const response = await api.get(`/products/${categoryId}/${typeId}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar productos filtrados:", error);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg">Cargando productos...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;

 
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      {/* Selector de tipo de producto */}
      <div className="flex justify-center mb-6">
        <select
          value={selectedType}
          onChange={(event) => setSelectedType(event.target.value)}
          className="p-2 border rounded-md shadow-sm bg-white dark:bg-gray-700 dark:text-white"
        >
          <option value="">Todos los tipos</option>
          {types.map((tipo) => (
            <option key={tipo._id} value={tipo._id}>
              {tipo.name}
            </option>
          ))}
        </select>
      </div>
      <div className="flex flex-wrap items-center justify-center">
        <h1 className="w-full text-5xl font-bold text-center p-8 dark:text-white ">{category.name} </h1>
        <p className="w-full text-2xl font-bold text-center p-8 dark:text-white ">{products.filter(product => product.stock > 0).length}</p>
        {products.length === 0 ? (
          <p className="text-center text-gray-500">No hay productos de este tipo</p>
        ) : (
          products.map((product) => (
            <ProductCard key={product._id} product={product} className="shadow-md rounded-md" />
          ))
        )}
      </div>
    </section>
  );
};


export default CatagoryProduct;