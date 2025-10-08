import mongoose from "mongoose";

const petitionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  image: { type: mongoose.Schema.Types.ObjectId, ref: "uploads.files" }, // GridFS file ID
  signatureGoal: { type: Number, required: true },
  signatures: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  status: {
    type: String,
    enum: ["active", "under review", "closed"],
    default: "active"
  },
  officialResponse: {
    text: { type: String },
    respondedAt: { type: Date },
    respondedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
  }
}, { timestamps: true });

export default mongoose.model("Petition", petitionSchema);
