import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    message: { type: String, required: true },
    timestamp: { type: Date, default: Date.now },
  },
  { _id: false }
);

const chatSchema = new mongoose.Schema(
  {
    users: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    ],
    messages: [messageSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Chat", chatSchema);
