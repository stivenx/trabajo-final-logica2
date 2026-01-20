import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { AuthContext } from "../context/AuthContext";
import { LogoutContext } from "../context/logoutContext";
import api from "../apiconfig/api";

const Navbar = () => {
  const { userId } = useContext(AuthContext);
  const [searchQuery, setSearchQuery] = useState("");
  const { totalItemsInCart } = useContext(CartContext);
  const {open} = useContext(LogoutContext)
  const navigate = useNavigate();
 const [productos, setProductos] = useState([]);
 const[showproducts, setShowProducts] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [categories, setCategories] = useState([]);
  const menuRef = useRef(null); // 🔹 Referencia al menú de categorías
  const menuRef2 = useRef(null); // 🔹 Referencia al menú de categorías
  const {toggleCart} = useContext(CartContext);
  const [products, setProducts] = useState([]);
  const[revel, setRevel] = useState(false);
  const menuRef3 = useRef(null);

  console.log("userId:", userId);
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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products");
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    fetchProducts();
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef2.current && !menuRef2.current.contains(event.target)) {
        setShowProducts(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() =>{
        const handleClickOutside =(e)=>{
          if(menuRef3.current && !menuRef3.current.contains(e.target)){
            setRevel(false)
          }
        }
       
       document.addEventListener("mousedown",handleClickOutside)
       return()=>{
        document.removeEventListener("mousedown",handleClickOutside)
       };
  },[])

  useEffect(() => {
    const fetchProductsLimit = async () => {
      if(searchQuery.trim().length===0){
        setRevel(false);
        setProducts([]);

      }
      try {
        const response = await api.get(`/products/search-limit/${searchQuery}`);
        setProducts(response.data);
        setRevel(true);
      } catch (error) {
        console.error("Error al obtener los productos:", error);
      }
    };
    const timeout = setTimeout(() => {
      fetchProductsLimit();
    }, 500);
    return () => clearTimeout(timeout); 
    
  }, [searchQuery]);

  /*const handleLogout = () => {
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("authChange"));
    navigate("/login");
  };*/

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?name=${searchQuery}`);
      setSearchQuery("");
      setRevel(false);
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

         {/* 🔍 Contenedor de la barra de búsqueda */}
          <div className="relative">
            {/* 🔽 Barra de búsqueda */}
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

            {/* 🔽 Resultados de búsqueda justo debajo */}
            {revel && (
              <div
                ref={menuRef3}
                className="absolute left-0 bg-white border border-gray-200 rounded-md shadow-md mt-1 w-[250px] z-50 overflow-hidden"
              >
                {products.length > 0 ? (
                  <>
                    {/* Mostrar solo los primeros 3 productos */}
                    {products.map((product) => (
                      <Link
                        key={product._id}
                        to={`/product/${product._id}`}
                        className="block px-3 py-2 text-gray-800 hover:bg-gray-100"
                        onClick={() => {
                          setSearchQuery("");
                          setRevel(false);
                          setProducts([]);
                          setShowProducts(false);
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <img
                            src={`http://localhost:5000/${product.images[0]}`}
                            alt={product.name}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <span>{product.name}</span>
                        </div>
                      </Link>
                    ))}

                    {/* 🔗 Botón "Ver todos" si hay más de 3 */}
                    {products.length > 3 && (
                      <button
                        onClick={handleSearch}
                        className="w-full text-center text-blue-600 font-medium py-2 border-t border-gray-200 hover:bg-gray-50"
                      >
                        Ver todos los resultados ({products.length})
                      </button>
                    )}
                  </>
                ) : (
                  <p className="px-3 py-2 text-gray-800">No se encontraron productos</p>
                )}
              </div>
            )}

 

          </div>
        <div className="hidden md:flex md:space-x-6 items-center">
          <Link to="/" className="text-gray-900 hover:text-primary-500 dark:text-white">
            Home
          </Link>
          <button
           onClick={toggleCart}  className="text-gray-500 hover:text-gray-700">carrito rapido</button>

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

          <div className="relative" ref={menuRef2}>
            <button
              onClick={() => setShowProducts(!showproducts)}
              className="text-gray-900 hover:text-primary-500 dark:text-white"
            >
              productos
            </button>

            {/* 🏷️ Menú desplegable */}
            {showproducts && (
              <div className="absolute left-0 mt-2 w-48 bg-white border rounded-md shadow-lg z-50">
                {productos.length > 0 ? (
                  productos.map((product) => (
                    <Link
                      key={product.id}
                      to={`/product/${product._id}`}
                      className="block px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => setShowProducts(false)} // 🔹 Cierra el menú al hacer clic
                    >
                      {product.name}
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

          <Link to="/prueba" className="text-gray-900 hover:text-primary-500 dark:text-white">
            Prueba
          </Link>
          <Link to="/products" className="text-gray-900 hover:text-primary-500 dark:text-white">
            Pruebaimagenes
          </Link>

          {localStorage.getItem("token") ? (
            <>
              <Link to="/admin" className="text-gray-900 hover:text-primary-500 dark:text-white">
                Admin
              </Link>
              <Link to="/cart" className="relative text-gray-900 hover:text-primary-500 dark:text-white">
                Carrito
               
         
              </Link>

              <Link to={`/users/edit/${userId}`} className="text-gray-900 hover:text-primary-500 dark:text-white">
                Editar perfil
              </Link>
              <button
                onClick={open}
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


