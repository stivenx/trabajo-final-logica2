import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../apiconfig/api";

const Navbar = () => {
  const { userId } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItemsInCart } = useContext(CartContext);
  const navigate = useNavigate();

  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const menuRef = useRef(null); // 🔹 Referencia al menú de categorías

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Error al obtener las categorías:", error);
      }
    };
    fetchCategories();
  }, []);

  // 🔹 Cierra el menú si el usuario hace clic fuera de él
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?name=${searchQuery}`);
      setSearchQuery("");
    }
  };

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-gray-900 transition-colors duration-300 shadow-md">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <Link to="/" className="flex items-center space-x-3">
          <img
            src="https://pio.edu.co/wp-content/uploads/2024/03/Logo-nuevo-PIO-2024.png"
            className="h-8"
            alt="Logo Tienda"
          />
          <span className="text-2xl font-semibold dark:text-white">
            Tienda Tecnológica
          </span>
        </Link>

        {/* 🔎 Barra de búsqueda */}
        <form className="flex items-center space-x-2" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border rounded-md px-3 py-1 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            className="px-3 py-1 bg-primary-500 text-white rounded-md hover:bg-primary-600"
          >
            Buscar
          </button>
        </form>

        <div className="hidden md:flex md:space-x-6 items-center">
          <Link to="/" className="text-gray-900 hover:text-primary-500 dark:text-white">
            Home
          </Link>

          {/* 🔹 Menú de Categorías - SOLUCIÓN */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setShowCategories(!showCategories)}
              className="text-gray-900 hover:text-primary-500 dark:text-white"
            >
              Categorías
            </button>

            {/* 🏷️ Menú desplegable */}
            {showCategories && (
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                {categories.length > 0 ? (
                  categories.map((category) => (
                    <Link
                      key={category.id}
                      to={`/category/${category._id}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowCategories(false)} // 🔹 Cierra el menú al hacer clic
                    >
                      {category.name}
                    </Link>
                  ))
                ) : (
                  <p className="px-4 py-2 text-gray-500">Cargando...</p>
                )}
              </div>
            )}
          </div>

          <Link to="/productsCategoType" className="text-gray-900 hover:text-primary-500 dark:text-white">
            Ver productos por tipo
          </Link>

          {localStorage.getItem("token") ? (
            <>
              <Link to="/admin" className="text-gray-900 hover:text-primary-500 dark:text-white">
                Admin
              </Link>
              <Link to="/cart" className="relative text-gray-900 hover:text-primary-500 dark:text-white">
                Carrito
                {(totalItemsInCart ?? 0) > 0 && (
                  <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-semibold w-5 h-5 flex items-center justify-center rounded-full">
                    {totalItemsInCart}
                  </span>
                )}
              </Link>

              <Link to={`/users/edit/${userId}`} className="text-gray-900 hover:text-primary-500 dark:text-white">
                Editar perfil
              </Link>
              <button
                onClick={handleLogout}
                className="text-gray-900 hover:text-primary-500 dark:text-white"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-gray-900 hover:text-primary-500 dark:text-white">
                Login
              </Link>
              <Link to="/register" className="text-gray-900 hover:text-primary-500 dark:text-white">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;


