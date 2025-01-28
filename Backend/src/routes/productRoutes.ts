import { Router } from "express";
import {getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getProductsByCategory, getProductsByCategoryByType, getProductsByType,searchProducts } from "../controllers/productController";
import { verifyToken, } from "../middleware/authMiddlewares";

const router = Router();

router.get("/", getAllProducts);    
router.get("/:id", getProduct);
router.get("/category/:id", getProductsByCategory);
router.get("/type/:id", getProductsByType);
router.get("/search/:name", searchProducts);
router.post("/",  createProduct);    
router.patch("/:id", updateProduct);
router.delete("/:id",deleteProduct)
router.get('/:categoryId/:typeId', getProductsByCategoryByType);

export default router;