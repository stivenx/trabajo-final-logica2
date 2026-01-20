import mongoose, { Schema, Document } from "mongoose";

export interface IComentarios extends Document {
    product: Schema.Types.ObjectId;
    email: Schema.Types.ObjectId;
    comentario: string;
    rating: number;
    images: string[];
    fechcreation: Date;
}

const comentarioSchema = new Schema<IComentarios>({
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    email: { type: Schema.Types.ObjectId, ref: "User", required: true },
    comentario: { type: String, required: true },
    rating: { type: Number, required: true },
    images: [{ type: String }],
    fechcreation: { type: Date, default: Date.now }
});

export default mongoose.model<IComentarios>("Comentarios", comentarioSchema);