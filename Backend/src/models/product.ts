import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    description: string;
    price: number;
    category: Schema.Types.ObjectId;
    stock: number;
    image?: string;
    type: Schema.Types.ObjectId
    

}

const productSchema = new Schema<IProduct>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    stock: { type: Number, required: true },
    image: { type: String },
    type: { type: Schema.Types.ObjectId, ref: "Type", required: true },
});

export default mongoose.model<IProduct>("Product", productSchema);