import mongoose, { Schema, Document } from "mongoose";

export interface OrderDoc extends Document {
    orderId: string
    vandorId: string
    items: any[]
    totalAmount: number
    paidAmount: number
    orderDate: Date
    orderStatus: string // waiting // failed // ACCEPT // REJECT // UNDER-PROCESS // READY // DELIVERED
    remarks: string
    deliverId: string
    readyTime: number // max 60 minutes
}

const orderSchema = new Schema(
  {
    orderId: {
      type: String,
      required: true,
    },
    vandorId: {
        type: Schema.Types.ObjectId,
        ref: "Vandor",
        required: true,
    },
    items: [
        {
            food: {
                type: Schema.Types.ObjectId,
                ref: "Food",
                required: true,
            },
            unit: {
                type: Number,
                required: true,
            },
        }
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paidAmount: {
        type: Number,
        required: true,
    },
    orderDate: {
      type: Date,
    },
    orderStatus: {
      type: String,
    },
    remarks: {
      type: String,
    },
    deliverId: {
      type: String,
    },
    readyTime: {
      type: Number,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
      },
    },
    timestamps: true,
  }
);

const Order = mongoose.model<OrderDoc>("Order", orderSchema);

export { Order };