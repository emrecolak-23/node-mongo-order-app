import mongoose, { Schema, Document, Model } from "mongoose"

interface VandorDoc extends Document {
    name: string;
    ownerName: string;
    foodType: string[];
    pincode: string;
    address: string;
    phone: string;
    email: string;
    password: string;
    salt: string;
    serviceAvailable: boolean,
    coverImages: string[],
    rating: number,
    foods: any
    lat: number,
    lng: number
}

const verdorSchema = new Schema({
    name: { type: String, required: true },
    ownerName: { type: String, required: true },
    foodType: [{ type: String, required: true }],
    pincode: { type: String, required: true },
    address: { type: String, required: true },
    phone: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (email: string) => !/\s/.test(email),
            message: "Email should not contain space"
        }
    },
    password: { type: String, required: true },
    salt: { type: String, required: true },
    serviceAvailable: { type: Boolean, required: true },
    coverImages: [{ type: String, required: true }],
    rating: { type: Number, required: true },
    foods: [{ type: Schema.Types.ObjectId, ref: "Food" }],
    lat: { type: Number },
    lng: { type: Number }
}, {
    toJSON: {
        transform: function (doc, ret) {
            delete ret.password
            delete ret.salt
            delete ret.__v
        }
    },
    timestamps: true,
})

const Vandor = mongoose.model<VandorDoc>("Vandor", verdorSchema)


export { Vandor, VandorDoc }



