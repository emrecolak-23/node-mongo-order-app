import mongoose, { Schema, Document } from "mongoose"

interface DeliveryUserDoc extends Document {
    email: string;
    password: string;
    phone: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    pincode: string;
    verified: boolean;
    lat: number;
    lng: number;
    isAvailable: boolean
   
}

const deliveryUserSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    pincode: { type: String },
    verified: { type: Boolean, required: true },
    lat: { type: Number },
    lng: { type: Number },
    isAvailable: { type: Boolean }
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

const DeliveryUser = mongoose.model<DeliveryUserDoc>("DeliveryUser", deliveryUserSchema)


export { DeliveryUser, DeliveryUserDoc }



