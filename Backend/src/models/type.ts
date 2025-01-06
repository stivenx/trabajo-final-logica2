import mongoose, { Schema, Document } from "mongoose";

export interface IType extends Document {
    name: string;
    description: string;
    fechcreation: Date;
}

const typeSchema = new Schema<IType>({
    name: { type: String, required: true },
    description: { type: String, required: true },
    fechcreation: { type: Date, default: Date.now }
});

export default mongoose.model<IType>("Type", typeSchema);