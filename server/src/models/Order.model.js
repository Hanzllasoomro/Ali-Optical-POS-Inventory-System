import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    qty: {
      type: Number,
      required: true,
      min: 1,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: {
      type: String,
      unique: true,
      index: true,
    },

    customerName: {
      type: String,
      default: "Walk-in Customer",
    },

    orderDate: {
      type: Date,
      default: Date.now,
      index: true,
    },

    deliveryDate: {
      type: Date,
    },

    items: [orderItemSchema],

    subtotal: Number,
    discount: {
      type: Number,
      default: 0,
    },
    total: Number,
    paidAmount: Number,
    balanceAmount: Number,

    paymentStatus: {
      type: String,
      enum: ["PAID", "PARTIAL", "UNPAID"],
      index: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
