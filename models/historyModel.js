import mongoose from "mongoose";

const historySchema = new mongoose.Schema(
  {
    history: [], // Array of Order IDs
  },
  { timestamps: true }
);

export default mongoose.model("history", historySchema);
