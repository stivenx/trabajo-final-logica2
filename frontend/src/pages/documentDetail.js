import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../apiconfig/api";

const DocumentDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await api.get(`/documents/${id}`);
        setDocument(response.data);
      } catch (error) {
        console.error("Error al obtener el documento:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDocument();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 dark:text-white">
        Cargando documento...
      </div>
    );
  }

  if (!document) {
    return (
      <div className="text-center text-gray-700 dark:text-white mt-10">
        No se encontró el documento.
      </div>
    );
  }

  const fileUrl = `http://localhost:5000/${document.fileUrl}`;
  const type = document.type;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8 flex flex-col items-center">
      <div className="bg-white dark:bg-gray-800 shadow-xl rounded-2xl p-6 w-full max-w-4xl">
        <button
          onClick={() => navigate(-1)}
          className="mb-4 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-2 px-4 rounded-lg transition"
        >
          ← Volver
        </button>

        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 text-center">
          {document.name}
        </h1>

        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Descripción:</strong>{" "}
          {document.description || "Sin descripción."}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-2">
          <strong>Tipo:</strong> {document.type}
        </p>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          <strong>Subido el:</strong>{" "}
          {new Date(document.uploadDate).toLocaleDateString()}
        </p>

        <div className="border rounded-xl overflow-hidden bg-gray-50 dark:bg-gray-700 mt-6">
          {type === "application/pdf" ? (
            <iframe
              src={fileUrl}
              title="Vista previa PDF"
              className="w-full h-[80vh] border-none"
            ></iframe>
          ) : type.startsWith("image/") ? (
            <img
              src={fileUrl}
              alt={document.name}
              className="w-full h-auto object-contain"
            />
          ) : (
            <iframe
              src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                fileUrl
              )}`}
              title="Vista previa documento"
              className="w-full h-[80vh] border-none"
            ></iframe>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentDetail;
