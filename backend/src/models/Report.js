import mongoose from "mongoose";

const reportSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['monthly', 'quarterly', 'annual'],
    required: true
  },
  period: {
    startDate: {
      type: Date,
      required: true
    },
    endDate: {
      type: Date,
      required: true
    }
  },
  location: {
    type: String,
    required: true
  },
  metrics: {
    totalPetitions: Number,
    activePetitions: Number,
    resolvedPetitions: Number,
    totalSignatures: Number,
    totalPolls: Number,
    totalVotes: Number,
    engagementRate: Number
  },
  summary: {
    type: String,
    required: true
  },
  generatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Report', reportSchema);