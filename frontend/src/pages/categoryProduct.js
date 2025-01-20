import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../apiconfig/api";
import ProductCard from "../components/ProductCard";


const CatagoryProduct = () => {
  const [products, setProductos] = useState([]);
  const [categoria, setCategoria] = useState({});
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const { id } = useParams("");
  const [type, setType] = useState([]);
  const [selectType, setSelectType] = useState("");


  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get(`/products/category/${id}`);
        const categoria = await api.get(`/categories/${id}`);
        setCategoria(categoria.data);
        setProductos(response.data);
        setLoading(false);
      } catch (error) {
        setError("Error al cargar los productos");
      }
    };


    const fetchTypes = async () => {
      try {
        const response = await api.get(`/types/`);
        setType(response.data);
      } catch (error) {
        setError("Error al cargar los tipos");
      }
    };


    fetchProductos().then(() => {
      fetchTypes();
      fetchProductsWithCategoryAndType();
    });
  }, [id, selectType]);


  const fetchProductsWithCategoryAndType = async () => {
    if (id && selectType) {
      fetchProductsCategoryType(id, selectType);
    };
  };


  const fetchProductsCategoryType = async (id, selectType) => {
    try {
      const response = await api.get(`/products/${id}/${selectType}`);
      setProductos(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  if (loading) {
    return <div>Loading...</div>;
  }


  return (
    <section className="bg-gray-50 dark:bg-gray-900 py-16">
      <select value={selectType} onChange={(event) => setSelectType(event.target.value)}>
        <option value="">Selecciona un tipo</option>
        {type && type.map((tipo) => (
          <option key={tipo._id} value={tipo._id}>
            {tipo.name}
          </option>
        ))}
      </select>
      <div className="flex flex-wrap items-center justify-center">
        <h1 className="w-full text-5xl font-bold text-center p-8 dark:text-white ">{categoria.name} </h1>
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