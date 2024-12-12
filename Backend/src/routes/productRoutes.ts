import { Router } from "express";
import {getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getProductsByCategory} from "../controllers/productController";
import { verifyToken, } from "../middleware/authMiddlewares";

const router = Router();

router.get("/", getAllProducts);    
router.get("/:id", getProduct);
router.get("/category/:id", getProductsByCategory);
router.post("/",  createProduct);    
router.patch("/:id", updateProduct);
router.delete("/:id",deleteProduct)

export default router;