import React, { useState, useEffect } from 'react';
import api from '../apiconfig/api';
import ProductCard from '../components/ProductCard';


const ProductosPorCategoriaYTipo = () => {
  const [categorias, setCategorias] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [categoryId, setCategoryId] = useState('');
  const [typeId, setTypeId] = useState('');
  const [products, setProducts] = useState([]);


  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await api.get('/categories/');
        setCategorias(response.data);
      } catch (error) {
        console.error("Error loading categories:", error);
      }
    };


    const loadTypes = async () => {
      try {
        const response = await api.get('/types/');
        setTipos(response.data);
      } catch (error) {
        console.error("Error loading types:", error);
      }
    };

    const fetchProducts = async () => {
      try {
        const response = await api.get('/products');
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };


    


    const fetchProductsWithCategoryAndType = async () => {
      if (categoryId && typeId) {
        fetchProductsCategoryType(categoryId, typeId);
      } else if (categoryId && !typeId) {
        fetchProductoscategory(categoryId);
      }else if (!categoryId && typeId) {
        fetchProductsType(typeId);
      }

      
      
    };


    loadCategories();
    loadTypes();
    fetchProducts();
    fetchProductsWithCategoryAndType();
  }, [categoryId, typeId]);


  const fetchProductsCategoryType = async (categoryId, typeId) => {
    try {
      const response = await api.get(`/products/${categoryId}/${typeId}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };


  const fetchProductoscategory = async (categoryId) => {
    try {
      const response = await api.get(`/products/category/${categoryId}`); 
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar los productos");
    }
  };

  const fetchProductsType = async (typeId) => {
    try {
      const response = await api.get(`/products/type/${typeId}`);
      setProducts(response.data);
    } catch (error) {
      console.error("Error al cargar los productos");
    }
  };


  


  return (
    <div>
      <h1>Productos por categoría y tipo</h1>
      <select value={categoryId} onChange={(event) => setCategoryId(event.target.value)}>
        <option value="">Selecciona una categoría</option>
        {categorias.map((categoria) => (
          <option key={categoria._id} value={categoria._id}>
            {categoria.name}
          </option>
        ))}
      </select>
      <select value={typeId} onChange={(event) => setTypeId(event.target.value)}>
        <option value="">Selecciona un tipo</option>
        {tipos.map((tipo) => (
          <option key={tipo._id} value={tipo._id}>
            {tipo.name}
          </option>
        ))}
      </select>
      <section className="bg-gray-50 dark:bg-gray-900 py-16">
        <div className="flex flex-wrap items-center justify-center">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} className="shadow-md rounded-md" />
          ))}
        </div>
      </section>
    </div>
  );
};


export default ProductosPorCategoriaYTipo;