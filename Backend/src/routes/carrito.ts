import { Router } from "express";
import { getCarrito, agregarProducto, eliminarProducto, actualizarTotal} from "../controllers/carritoController";
import { verifyToken } from "../middleware/authMiddlewares";

const router = Router();



export default router;