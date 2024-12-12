import React, { useEffect, useState } from "react";
import api from "../apiconfig/api";
import { Link } from "react-router-dom";





const Categorys = () => {
    const [categorys, setCategory] = useState([]);
  
    useEffect(() => {
      const fetchCategorias = async () => {
        try {
          const response = await api.get("/categories/");
          console.log("Categorias obtenidas:", response.data);

          setCategory(response.data);
        } catch (err) {
          console.error("Error al obtener las categorias:", err);
        }
      };
  
      console.log("Ejecutando fetchCategorias"); // Agrega un console.log aquí
      fetchCategorias();
    }, []);
  
    console.log("Renderizando componente Categorias"); // Agrega un console.log aquí
    return (
      <div className="min-h-screen flex flex-col">
  <div className="flex-1 bg-gray-100 dark:bg-gray-800 shadow-md rounded-lg p-8 flex flex-wrap justify-center dark:text-white">
    <h1 className="w-full text-6xl font-bold text-center p-12 text-gray-600 dark:text-white">CATEGORIAS</h1>
    <ul className="categorias list-none p-0 m-0 flex flex-wrap justify-center gap-4">
      {categorys.map((categoria) => (
        <Link to={`/category/${categoria._id}`} key={categoria._id}>
          <li key={categoria._id} className="w-full max-w-lg bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 mb-8 ml-8 hover:bg-gray-200 hover:shadow-lg transition duration-300 ease-in-out">
            <div className="px-12 pb-12">
              <h5 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white text-center mb-4">{categoria.name}</h5>
              <span className="text-lg font-bold text-black dark:text-white">{categoria.description}</span>
            </div>
            <div className="flex items-center justify-center ">
              <Link to={`/category/${categoria._id}`} className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-lg px-4 py-2 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Ver categoría</Link>
            </div>
          </li>
        </Link>
      ))}
    </ul>
  </div>
</div>
    );
  };
export default Categorys;