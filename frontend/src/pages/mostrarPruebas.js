
import { useEffect, useState } from "react";
import api from "../apiconfig/api";
import { Link } from "react-router-dom";

export default function ProductList() {
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get("/prueba");
        setProductos(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/prueba/${id}`);
      setProductos(productos.filter((producto) => producto._id !== id));
    } catch (error) {
      console.error("Error al eliminar producto:", error);
    }
  };

  return (
    <div className="grid gap-6 p-6 md:grid-cols-2 lg:grid-cols-3">
      <Link to="/create2">crear</Link>
      {productos.map((producto) => (
        <ProductoCard key={producto._id} producto={producto} handleDelete={handleDelete}  />
      ))}
    </div>
  );
}
function ProductoCard({ producto, handleDelete }) {
  // Estado local para controlar qué imagen se está mostrando actualmente
  const [currentImg, setCurrentImg] = useState(0);

  // Verifica si el producto tiene más de una imagen
  const hasMultipleImages = producto.images?.length > 1;

  // Función para ir a la imagen siguiente (con vuelta al inicio si llega al final)
  const nextImg = () => {
    setCurrentImg((prev) =>
      prev === producto.images.length - 1 ? 0 : prev + 1
    );
  };

  // Función para ir a la imagen anterior (con vuelta al final si llega al inicio)
  const prevImg = () => {
    setCurrentImg((prev) =>
      prev === 0 ? producto.images.length - 1 : prev - 1
    );
  };

  return (
    <div className="border rounded-xl shadow-md p-4 bg-white">
      {/* Nombre del producto */}
      <h2 className="text-xl font-bold mb-2">{producto.name}</h2>

      {/* Descripción del producto */}
      <p className="mb-2 text-gray-700">{producto.description}</p>

      {/* Precio del producto */}
      <p className="mb-4 font-semibold text-green-600">
        Precio: ${producto.price}
      </p>

      {/* Mostrar imágenes solo si hay al menos una */}
      {producto.images?.length > 0 && (
        <div className="relative mb-4">
          {/* Imagen principal actual */}
          <img
            src={`http://localhost:5000/${producto.images[currentImg].replace(
              /\\/g,
              "/"
            )}`}
            alt="Producto"
            className="w-full h-60 object-cover rounded-lg"
          />

          {/* Flechas de navegación solo si hay más de una imagen */}
          {hasMultipleImages && (
            <>
              {/* Flecha para imagen anterior */}
              <button
                onClick={prevImg}
                className="absolute top-1/2 left-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                ‹
              </button>

              {/* Flecha para imagen siguiente */}
              <button
                onClick={nextImg}
                className="absolute top-1/2 right-2 -translate-y-1/2 bg-black bg-opacity-50 text-white p-2 rounded-full"
              >
                ›
              </button>

              {/* Burbujas clicables que indican la imagen actual */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-2">
                {producto.images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImg(index)} // cambia a la imagen clicada
                    className={`w-3 h-3 rounded-full border ${
                      index === currentImg
                        ? "bg-white border-white" // activa
                        : "bg-gray-400 border-gray-400" // inactiva
                    }`}
                    aria-label={`Ver imagen ${index + 1}`} // accesibilidad
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Botón para ver detalles del producto */}
      <Link to={`/prueba/${producto._id}`}>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg transition">
          Ver detalles
        </button>
      </Link>
      <Link to={`/edit/${producto._id}`}>editar </Link>
      <button onClick={() => handleDelete(producto._id)}>eliminar</button>
    </div>
  );
}
