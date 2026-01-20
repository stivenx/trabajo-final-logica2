import { useState, useContext } from "react";
import api from "../apiconfig/api";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";


const DocumentsCreate = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const { userId } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return alert("Por favor selecciona un archivo.");

    const formData = new FormData();
    formData.append("name", title);
    formData.append("description", description);
    formData.append("images", file);
    formData.append("user", userId);

    try {
      const response = await api.post("/documents/create", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log(response.data);
      navigate("/documents");
    } catch (error) {
      console.error(error);
      alert("Error al subir el documento");
    }
  };

  const handleAddFile = (e) => {
    const selected = e.target.files[0];
    if (!selected) return;

    setFile(selected);

    const type = selected.type;
    if (type.startsWith("image/")) {
      setPreview({ type: "image", src: URL.createObjectURL(selected) });
    } else if (type === "application/pdf") {
      setPreview({ type: "pdf", src: URL.createObjectURL(selected) });
    }else if(type === "video/mp4"){
      setPreview({ type: "video", src: URL.createObjectURL(selected) });
    }
     else {
      setPreview({ type: "other", name: selected.name });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 shadow-lg rounded-2xl p-8 w-full max-w-lg space-y-6"
      >
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white">
          Crear Documento
        </h1>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Título:
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="Ejemplo: Contrato de servicio"
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Descripción:
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-2 border rounded-lg dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="Detalles o notas sobre el documento..."
          />
        </div>

        <div>
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1">
            Archivo:
          </label>
          <input
            type="file"
            
            onChange={handleAddFile}
            className="w-full p-2 border rounded-lg cursor-pointer dark:bg-gray-700 dark:text-white dark:border-gray-600"
          />
        </div>

        {preview && (
          <div className="mt-4 border rounded-lg p-4 bg-gray-100 dark:bg-gray-700 flex flex-col items-center">
            <h3 className="text-gray-800 dark:text-gray-200 font-semibold mb-2">
              Vista previa:
            </h3>

            {preview.type === "image" && (
              <img
                src={preview.src}
                alt="Vista previa"
                className="w-40 h-40 object-cover rounded-lg shadow"
              />
            )}

            {preview.type === "pdf" && (
              <iframe
                src={preview.src}
                className="w-full h-64 border rounded-lg"
                title="Vista previa PDF"
              ></iframe>
            )}

            {preview.type === "other" && (
              <p className="text-gray-600 dark:text-gray-400">
                Archivo: {preview.name}
              </p>
            )}
          

           {preview.type === "video" && (
              <video
                className="w-full h-64 border rounded-lg"
                controls
              >
                <source src={preview.src} type="video/mp4" />
              </video>
            )}
          </div>
        )}


        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
        >
          Subir documento
        </button>
      </form>
    </div>
  );
};

export default DocumentsCreate;
