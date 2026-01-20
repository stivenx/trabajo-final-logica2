import { Router } from "express";
import {getAllProducts, getProduct, createProduct, updateProduct, deleteProduct, getProductsByCategory, getProductsByCategoryByType, getProductsByType,searchProducts,searchProductsLimit,getProductsByCategoryByType2,upload  } from "../controllers/productController";
import { verifyToken, } from "../middleware/authMiddlewares";

const router = Router();

// 🟩 Rutas de búsqueda (fijas, van primero)
router.get("/search-limit/:name?", searchProductsLimit);
router.get("/search/:name", searchProducts);

// 🟦 Rutas por categoría o tipo
router.get("/category/:id", getProductsByCategory);
router.get("/type/:id", getProductsByType);



// 🟨 Rutas combinadas
router.get("/categoryType/:categoryId/:typeId", getProductsByCategoryByType);
router.get("/categoryType2/:categoryId", getProductsByCategoryByType2);

// 🟪 CRUD general
router.get("/", getAllProducts);
router.get("/:id", getProduct);
router.post("/",upload.array("images", 5) ,createProduct);
router.patch("/:id",upload.array("images", 5) ,updateProduct);
router.delete("/:id", deleteProduct);

export default router;