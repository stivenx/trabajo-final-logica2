import mongoose, { Schema, Document } from "mongoose";

export interface ICarrito extends Document {
    User: Schema.Types.ObjectId;
    products: Schema.Types.ObjectId[];
    total: number;
}

const carritoSchema = new Schema<ICarrito>({
    User: { type: Schema.Types.ObjectId, ref: "User", required: true },
    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    total: { type: Number, default: 0 }
});

export default mongoose.model<ICarrito>("Carrito", carritoSchema);