import mongoose, { Schema, Document } from "mongoose";

export interface ICategory extends Document {
    name: string;
    description: string;
    fechcreation: Date;
   
}


const categorySchema = new Schema<ICategory>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    fechcreation: { type: Date, default: Date.now }
});

export default mongoose.model<ICategory>("Category", categorySchema);