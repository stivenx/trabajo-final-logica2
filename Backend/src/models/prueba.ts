import mongoose, { Schema, Document } from "mongoose";

export interface IPrueba extends Document {
  name: string;
  description: string;
  price: number;
  images: string[]; // rutas de imágenes
}

const pruebaSchema = new Schema<IPrueba>({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [{ type: String }], // array de strings
});

export default mongoose.model<IPrueba>("Prueba", pruebaSchema);
