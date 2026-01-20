import React, { useState, useEffect, useContext } from "react";
import { useParams} from "react-router-dom";
import api from "../apiconfig/api";
import ProductCard from "../components/ProductCard";
import { TitlesContext } from "../context/titlesContext";
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
   const {setTitle} = useContext(TitlesContext);

  // Fetch de productos y categorías
  useEffect(() => {
     // 🔥 Limpia inmediatamente
   
    setError("");
      
    const fetchTypes = async () => {
      try {
        const response = await api.get(`/types/`);
        setTypes(response.data);
      } catch (error) {
        setError("Error al cargar los tipos");
      }
    };
 
    fetchTypes();

  }, [id,]);


  

  useEffect(() => {
    if(category.name){
      if(selectedType){
        const selectedType2 = types.find((type) => type._id === selectedType)?.name;
        if(selectedType2){
          setTitle(`tienda tecnologica -${category.name}/${selectedType2}`)
        }else{
          setTitle(`tienda tecnologica -${category.name}`)
        }
      
      }else{
        setTitle(`tienda tecnologica -${category.name}`)
      }


    }
  }, [category.name,selectedType])
  const fetchProductos = async () => {
     setCategory({});
    setProducts([]);
    setLoading(true);
    setError("");
    
    try {
      const response = await api.get(`/products/category/${id}`);
      
   
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      setError("Error al cargar los productos");
    }
  };

  const fectCategoris = async () => {
    try {
      const response = await api.get(`/categories/${id}`);
      setCategory(response.data);
    } catch (error) {
      console.error("Error al obtener la categoría:", error);
    }
  };

  // Fetch de productos por tipo y categoría
  useEffect(() => {
    
     
    if (selectedType) {
      fetchProductsByCategoryAndType(id, selectedType);
      fectCategoris();
    } else {
      fetchProductos()
      fectCategoris();
    }
  }, [id, selectedType, cart]);

  // Obtener productos por categoría
 

  // Obtener productos por categoría y tipo
  const fetchProductsByCategoryAndType = async (categoryId, typeId) => {
    setCategory({});
    setProducts([]);
    setLoading(true);
    setError("");
    try {
      const response = await api.get(`/products/categoryType/${categoryId}/${typeId}`);
      setProducts(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error al cargar productos filtrados:", error);
    }
  };

  const fetchProductsByCategoryAndType2 = async (categoryId, typeId) => {
    try {
      const response = await api.get(`/products/categoryType2/${categoryId}`,{
        params: {
          typeId: selectedType.join(',')
        }
      });
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar productos filtrados:", error);
    }
  };

  if (loading) return <div className="text-center py-10 text-lg">Cargando productos...</div>;
  if (error) return <div className="text-center text-red-500 py-10">{error}</div>;
 
/*  const handlectTypeChange = (id) => {
    setSelectedType((prev) =>
      prev.includes(id)
        ? prev.filter((item) => item !== id)
        : [...prev, id]

    );
  };*/
  /*
        <label key={tipo._id} className="mr-4 flex items-center">
            <input
              type="checkbox"
              checked={selectedType.includes(tipo._id)}
              onChange={() => handlectTypeChange(tipo._id)}
              className="mr-2"
            />
            {tipo.name}
          </label>
          */
        
  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      {/* Selector de tipo de producto */}
      <div className="flex justify-center mb-6">
        <select
           value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
        >
          <option value="">Todos</option>
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