import mongoose, { Schema, Document } from "mongoose"

interface CustomerDoc extends Document {
    email: string;
    password: string;
    phone: string;
    salt: string;
    firstName: string;
    lastName: string;
    address: string;
    verified: boolean;
    otp: number;
    otpExpiry: Date;
    lat: number;
    lng: number;
}

const customerSchema = new Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    salt: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    address: { type: String },
    verified: { type: Boolean, required: true },
    otp: { type: Number, required: true },
    otpExpiry: { type: Date, required: true },
    lat: { type: Number },
    lng: { type: Number },
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

const Customer = mongoose.model<CustomerDoc>("Customer", customerSchema)


export { Customer, CustomerDoc }



