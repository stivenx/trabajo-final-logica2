import  Express  from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/catrgory";
import typeroutes from "./routes/typeRoutes";
import carritoroutes from "./routes/carrito";

const app = Express();

app.use(cors());
app.use(Express.json());
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/types", typeroutes);
app.use("/api/carts", carritoroutes);

export default app;