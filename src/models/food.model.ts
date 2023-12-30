import mongoose, { Schema, Document, Model } from "mongoose";


interface FoodDoc extends Document {
    vandorId: string;
    name: string;
    description: string;
    category: string;
    foodType: string;
    readyTime: number;
    price: number;
    rating: number;
    images: string[];
}

const foodSchema = new Schema({
    vandorId: { type: Schema.Types.ObjectId, ref: "Vandor", required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    foodType: { type: String, required: true },
    readyTime: { type: Number, required: true },
    price: { type: Number, required: true },
    rating: { type: Number },
    images: [{ type: String, required: true }]
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v
            delete ret.createdAt
            delete ret.updatedAt
        }
    },
    timestamps: true,
})

const Food = mongoose.model<FoodDoc>("Food", foodSchema)

export { Food, FoodDoc }