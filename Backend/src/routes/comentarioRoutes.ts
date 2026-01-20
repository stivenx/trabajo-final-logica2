import express from "express";
import {createcomentario,upload,getcomentarios,comentariosUpdate,deletecomentario  } from "../controllers/comentariosController";

const router = express.Router();

// Ruta para crear comentario con múltiples imágenes
router.post("/create", upload.array("images", 5), createcomentario); // hasta 5 imágenes

// Ruta para obtener todos los comentarios
router.get("/:id", getcomentarios);

// Ruta para actualizar un comentario por ID
router.put("/:id", upload.array("images", 5), comentariosUpdate); // hasta 5 imágenes

// Ruta para eliminar un comentario por ID
router.delete("/:id", deletecomentario);

export default router;