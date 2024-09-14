import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    products: [],

    tableNumber: {
      type: Number,
      required: true,
    },
    buyer: {},
    total: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
