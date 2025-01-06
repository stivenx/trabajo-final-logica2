import  Express  from "express";
import cors from "cors";
import productRoutes from "./routes/productRoutes";
import userRoutes from "./routes/userRoutes";
import categoryRoutes from "./routes/catrgory";
import typeroutes from "./routes/typeRoutes";

const app = Express();

app.use(cors());
app.use(Express.json());
app.use("/api/products", productRoutes);
app.use("/api/users", userRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/types", typeroutes);

export default app;