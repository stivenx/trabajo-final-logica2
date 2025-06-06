import express from "express";
import { createPrueba, upload, getPruebas, getPrueba,updatePrueba, deletePrueba } from "../controllers/pruebacontroller";

const router = express.Router();

// Ruta para crear producto con múltiples imágenes
router.post("/create", upload.array("images", 5), createPrueba); // hasta 5 imágenes

// Ruta para obtener todos los productos
router.get("/", getPruebas);

// Ruta para obtener un producto por ID
 router.get("/:id", getPrueba);

// Ruta para actualizar un producto por ID
router.put("/:id", upload.array("images", 5), updatePrueba); // hasta 5 imágenes

// Ruta para eliminar un producto por ID
router.delete("/:id", deletePrueba);

export default router;
