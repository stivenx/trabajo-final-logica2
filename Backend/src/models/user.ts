import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    direction: string;
    fechcreation: Date;

}

const userSchema = new Schema<IUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    direction: { type: String, required: true },
    fechcreation: { type: Date, default: Date.now }
    
});

export default mongoose.model<IUser>("User", userSchema);