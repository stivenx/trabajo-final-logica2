import { useEffect, useState, useContext } from "react";
import api from "../apiconfig/api";
import { AuthContext } from "../context/AuthContext";
import { Link } from "react-router-dom";

const DocumentsList = () => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchDocuments = async () => {
      try {
        const response = await api.get(`/documents/user/${userId}`);
        setDocuments(response.data);
      } catch (error) {
        console.error("Error al obtener documentos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocuments();
  }, [userId]);
  const deletedDocument = async(id) => {
     try{
      const response = await api.delete(`/documents/${id}`);
      if (response.status === 200) {
        setDocuments(documents.filter((doc) => doc._id !== id));
      }
    } catch (error) {
      console.error("Error al eliminar el documento:", error);
    }

  } 

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700 dark:text-white">
        Cargando documentos...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800 dark:text-white">
        Mis Documentos
      </h1>

      {documents.length === 0 ? (
        <p className="text-center text-gray-600 dark:text-gray-300">
          No tienes documentos subidos.
        </p>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {documents.map((doc) => (
            <div
              key={doc._id}
              className="bg-white dark:bg-gray-800 shadow rounded-xl p-4 flex flex-col justify-between"
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  {doc.name}
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
                  {doc.description || "Sin descripción"}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Tipo: {doc.type}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Subido el: {new Date(doc.uploadDate).toLocaleDateString()}
                </p>
              </div>

              <div className="mt-4 flex gap-2">
                <a
                  href={`http://localhost:5000/${doc.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Ver
                </a>

                <Link
                  to={`/documents/${doc._id}`}
                  className="w-full text-center bg-gray-700 hover:bg-gray-800 text-white py-2 rounded-lg font-semibold transition"
                >
                  Vista previa
                </Link>
                <button
                  onClick={() => deletedDocument(doc._id)}
                  className="w-full text-center bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg font-semibold transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentsList;
