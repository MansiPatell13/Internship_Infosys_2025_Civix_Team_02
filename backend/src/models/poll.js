import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  options: [{ text: String, votes: { type: Number, default: 0 } }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  targetLocation: String,
  closesOn: Date,
}, { timestamps: true });

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;
