import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    amount: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      enum: [
        "RENT",
        "ELECTRICITY",
        "INTERNET",
        "PURCHASE",
        "SALARY",
        "MAINTENANCE",
        "OTHER",
      ],
      index: true,
    },

    expenseDate: {
      type: Date,
      default: Date.now,
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

export default mongoose.model("Expense", expenseSchema);
