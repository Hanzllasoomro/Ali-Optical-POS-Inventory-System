import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      index: true,
    },

    category: {
      type: String,
      enum: ["FRAME", "LENS", "GLASSES", "HEARING_AID", "LENS_WATER", "ACCESSORY", "SUNGLASS", "EYE_TESTING"],
      required: true,
      index: true,
    },

    costPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    sellingPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    stockQty: {
      type: Number,
      required: true,
      min: 0,
    },

    reorderLevel: {
      type: Number,
      default: 5,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Product", productSchema);
