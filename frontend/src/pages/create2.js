import { useState } from "react";
import api from "../apiconfig/api";
import { useNavigate } from "react-router-dom";

export default function Create2() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [images, setImages] = useState(null);
  const [previewImages, setPreviewImages] = useState([]); // ⬅️ Para mostrar las vistas previas
  const navigate = useNavigate();

  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);

    if (images) {
      for (const file of images) {
        formData.append("images", file);
      }
    }

    try {
      const response = await api.post("/prueba/create", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/products");
      console.log("Producto creado:", response.data);
    } catch (error) {
      alert("Hubo un problema al crear el producto");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <input
        type="text"
        placeholder="Descripción"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        required
      />
      <input
        type="number"
        placeholder="Precio"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        required
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={(e) => setImages(e.target.files)}
      />

      

      <button type="submit">Crear producto</button>
    </form>
  );
}



/*import { useState } from "react";
import api from "../config/api"; // Axios preconfigurado
import { useNavigate } from "react-router-dom";

export default function CreateDocumento() {
  const [titulo, setTitulo] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagenes, setImagenes] = useState([]);
  const [preview, setPreview] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setImagenes(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("titulo", titulo);
    formData.append("descripcion", descripcion);
    for (const file of imagenes) {
      formData.append("imagenes", file); // este nombre debe coincidir con el backend
    }

    try {
      await api.post("/documentos", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/documentos");
    } catch (err) {
      console.error("Error al crear documento:", err);
      alert("Hubo un error al subir el documento.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 max-w-md mx-auto">
      <input
        type="text"
        placeholder="Título"
        value={titulo}
        onChange={(e) => setTitulo(e.target.value)}
        required
        className="w-full border p-2"
      />
      <textarea
        placeholder="Descripción"
        value={descripcion}
        onChange={(e) => setDescripcion(e.target.value)}
        className="w-full border p-2"
      />
      <input
        type="file"
        multiple
        accept="image/*"
        onChange={handleFileChange}
        className="block"
      />

      <div className="flex flex-wrap gap-2 mt-2">
        {preview.map((src, idx) => (
          <img key={idx} src={src} alt="" className="w-24 h-24 object-cover rounded" />
        ))}
      </div>

      <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
        Crear documento
      </button>
    </form>
  );
}
*/