import express from "express";
import { getCart, addToCart, removeFromCart, clearCart,updateItemQuantity } from "../controllers/carritoController";

const router = express.Router();

// Obtener el carrito de un usuario
router.get("/:userId", getCart);

// Agregar un producto al carrito
router.post("/", addToCart);

// Eliminar un producto del carrito
router.delete("/:userId/:productId", removeFromCart);

// Vaciar el carrito
router.delete("/:userId", clearCart);

// Actualizar la cantidad de un producto en el carrito
router.patch("/:userId/:productId", updateItemQuantity);

export default router;
