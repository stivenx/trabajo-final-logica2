import { useState, useEffect } from "react";
import api from "../apiconfig/api";
import { useNavigate, useParams } from "react-router-dom";

const ProductoUpdateForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [existingImages, setExistingImages] = useState([]);
  const [imagesToDelete, setImagesToDelete] = useState([]);
  const [newImages, setNewImages] = useState([]);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const res = await api.get(`/prueba/${id}`);
        
        setName(res.data.name);
        setDescription(res.data.description);
        setPrice(res.data.price);
        setExistingImages(res.data.images);
      
      } catch (error) {
        console.error("Error al cargar producto:", error);
      }
    };
    fetchProducto();
  }, [id]);

  const handleImageDeleteToggle = (imgPath) => {
    setImagesToDelete((prev) =>
      prev.includes(imgPath)
        ? prev.filter((img) => img !== imgPath) // la elimina si ya estaba
        : [...prev, imgPath] // la agrega si no estaba
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("imagesToDelete", JSON.stringify(imagesToDelete));

    for (const file of newImages) {
      formData.append("images", file);
    }

    try {
      await api.put(`/prueba/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/products");
    } catch (error) {
      console.error("Error al actualizar producto:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold">Editar Producto</h1>

      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre"
        className="w-full border p-2 rounded"
      />

      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
        className="w-full border p-2 rounded"
      />

      <input
        type="number"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Precio"
        className="w-full border p-2 rounded"
      />

      <div>
        <label className="block mb-1 font-medium">Imágenes actuales:</label>
        <div className="flex flex-wrap gap-2">
          {existingImages.map((img, idx) => (
            <div key={idx} className="relative w-24 h-24">
              <img
                src={`http://localhost:5000/${img.replace(/\\/g, "/")}`}
                alt=""
                className="w-full h-full object-cover rounded"
              />
              <input
                type="checkbox"
                checked={imagesToDelete.includes(img)}
                onChange={() => handleImageDeleteToggle(img)}
                className="absolute top-1 right-1"
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block mb-1 font-medium">Nuevas imágenes:</label>
        <input
          type="file"
          multiple
          onChange={(e) => setNewImages([...e.target.files])}
          className="w-full"
          
        />
      </div>

      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
      >
        Guardar cambios
      </button>
    </form>
  );
};

export default ProductoUpdateForm;


