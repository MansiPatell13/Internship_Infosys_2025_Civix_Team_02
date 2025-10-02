import mongoose from "mongoose";

const pollSchema = new mongoose.Schema({
  title: { 
    type: String, 
    required: true 
  },
  description: String,
  options: [{ 
    text: String, 
    votes: { 
      type: Number, 
      default: 0 
    } 
  }],
  createdBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User",
    required: true
  },
  target_location: { 
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'closed'],
    default: 'active'
  },
  isOfficialPoll: {
    type: Boolean,
    default: false
  },
  closedAt: Date,
  closedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  },
  closedReason: String
}, { 
  timestamps: true 
});

const Poll = mongoose.model("Poll", pollSchema);

export default Poll;