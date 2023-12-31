import mongoose, { Schema, Document } from "mongoose";


export interface TransactionDoc extends Document {
    customer: string,
    vandorId: string,
    orderId: string,
    orderValue: number
    offerUsed: string
    status: string
    paymentMode: string
    paymentResponse: string
}



export const transactionSchema = new Schema({
    customer: {
        type: Schema.Types.ObjectId,
        ref: "Customer",
        required: true,
    },
    vandorId: { type: String },
    orderId: {
        type: String,
    },
    orderValue: {
        type: Number,
        required: true,
    },
    offerUsed: {
        type: String,
    },
    status: {
        type: String,
    },
    paymentMode: {
        type: String,
    },
    paymentResponse: {
        type: String,
    },

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


const Transaction = mongoose.model<TransactionDoc>("Transaction", transactionSchema)


export { Transaction }