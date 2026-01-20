import  { Request, Response } from "express";
import Document from "../models/documents";
import multer from "multer";
import path from "path";
import fs from "fs";

const routesimages = path.join(__dirname, "../../documents");
if(!fs.existsSync(routesimages)){
        fs.mkdirSync(routesimages);
        
}
const storage = multer.diskStorage({
    destination: routesimages,
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

export const upload = multer({ storage });


export const createDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { user, name, description } = req.body;
    const files = req.files as Express.Multer.File[]; // forzamos el tipo
    const fileUrl = files && files.length > 0 ? `documents/${files[0].filename}` : null;
    const type = files && files.length > 0 ? files[0].mimetype : null;

    const newDocument = new Document({ user, name, type, fileUrl, description });
    await newDocument.save();
    res.status(200).json(newDocument);
  } catch (error) {
    console.error("Error al crear el documento:", error);
    res.status(500).json({ message: "Error al crear el documento" });
  }
};

export const getDocumentsEspecifi = async (req: Request, res: Response): Promise<void> => {
  try {
    const {userId} =req.params;
    const documents = await Document.find({user:userId});
    res.status(200).json(documents);

  } catch (error) {
    console.error("Error al obtener los documentos:", error);
    res.status(500).json({ message: "Error al obtener los documentos" });
  }
};


export const getDocuments = async (req: Request, res: Response): Promise<void> => {
  try {
    const documents = await Document.find();
    res.status(200).json(documents);
  } catch (error) {
    console.error("Error al obtener los documentos:", error);
    res.status(500).json({ message: "Error al obtener los documentos" });
  }
};


export const getDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const document = await Document.findById(id);
    res.status(200).json(document);
  } catch (error) {
    console.error("Error al obtener el documento:", error);
    res.status(500).json({ message: "Error al obtener el documento" });
  }
};

export const deleteDocument = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // 1️⃣ Buscar el documento por ID
    const document = await Document.findById(id);
    if (!document) {
      res.status(404).json({ message: "Documento no encontrado" });
      return;
    }

    // 2️⃣ Obtener la ruta física del archivo
    // document.fileUrl podría ser algo como "uploads/docs/archivo.docx"
   
    const filePath = path.join(__dirname, "../../",document.fileUrl);

    // 3️⃣ Verificar si el archivo existe antes de eliminarlo
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      console.log(`Archivo eliminado: ${filePath}`);
    } else {
      console.warn(`Archivo no encontrado: ${filePath}`);
    }

    // 4️⃣ Eliminar el registro de la base de datos
    await Document.findByIdAndDelete(id);

    // 5️⃣ Respuesta exitosa
    res.status(200).json({ message: "Documento eliminado correctamente" });

  } catch (error) {
    console.error("Error al eliminar el documento:", error);
    res.status(500).json({ message: "Error al eliminar el documento" });
  }
};