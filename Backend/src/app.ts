import  Express  from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/catrgory";
import typeroutes from "./routes/typeRoutes";
import carritoroutes from "./routes/carrito";
import pruebaRoutes from "./routes/prueba";
import path from "path";
const app = Express();
 
// Servir archivos estáticos desde la carpeta uploads
app.use("/uploads", Express.static(path.join(__dirname, "../uploads")));

app.use(cors());
app.use(Express.json());
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/types", typeroutes);
app.use("/api/carts", carritoroutes);
app.use("/api/prueba", pruebaRoutes);

export default app;