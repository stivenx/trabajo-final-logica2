import mongoose, { Schema, Document } from "mongoose";

export interface ICart extends Document {
    user: Schema.Types.ObjectId;
    items: {
        product: Schema.Types.ObjectId;
        quantity: number;
    }[];
    createdAt: Date;
}

const cartSchema = new Schema<ICart>({
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: [
        {
            product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
            quantity: { type: Number, required: true, min: 1 },
        },
    ],
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ICart>("Cart", cartSchema);
