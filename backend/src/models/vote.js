import mongoose from "mongoose";

const voteSchema = new mongoose.Schema({
  pollId: { type: mongoose.Schema.Types.ObjectId, ref: "Poll", required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  selectedOption: { type: Number, required: true }, // index of chosen option
}, { timestamps: true });

const Vote = mongoose.model("Vote", voteSchema);

export default Vote;
