import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../apiconfig/api";

export default function Productid() {
  const [producto, setProducto] = useState([]);
 
 const { id } = useParams();
  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const response = await api.get(`/prueba/${id}`); 
        setProducto(response.data);
      } catch (error) {
        console.error("Error al obtener productos:", error);
      }
    };

    fetchProductos();
  }, []);

  return (
    <div>
      <h1>Productos</h1>
      <ul>
       <p>{producto.name}</p>
       <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
            {producto.images?.map((img, index) => (
              <img
                key={index}
                src={`http://localhost:5000/${img.replace(/\\/g, "/")}`} // para Windows
                alt="Producto"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            ))}
          </div>
      </ul>
    </div>
  );
}