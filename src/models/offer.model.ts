import mongoose, { Schema, Document, Model } from "mongoose";

export interface OfferDoc extends Document {
    offerType: string, // Vandor // Generic
    vandors: [any] // ["a2312413551"]
    title: string // INR 200 off on week days
    description: string // any description with terms and conditions
    minValue: number // minimum order amount should be 300
    offerAmount: number // 200
    startValididty: Date  // 
    endValididty: Date
    promocode: string // WEEK200
    promoType: string // USER // ALL // BANK // CARD
    bank: [any] //
    bins: [any] //
    pincode: string
    isActive: boolean
}

const offerSchema = new Schema({
    offerType: {
        type: String,
        required: true,
    },
    vandors: [{
        type: Schema.Types.ObjectId,
        ref: "Vandor",
        required: true,
    }],
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    minValue: {
        type: Number,
        required: true
    },
    offerAmount: {
        type: Number,
        required: true,
    },
    startValididty: {
        type: Date,
    },
    endValididty: {
        type: Date,
    },
    promocode: {
        type: String,
        required: true,
    },
    promoType: {
        type: String,
        required: true,
    },
    bank: [{
        type: String,
    }],
    bins: [{
        type: String,
    }],
    pincode: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true,
    },

},
{
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v
            delete ret.createdAt
            delete ret.updatedAt
        }
    },
    timestamps: true,
})

const Offer = mongoose.model<OfferDoc>("Offer", offerSchema)

export { Offer }


