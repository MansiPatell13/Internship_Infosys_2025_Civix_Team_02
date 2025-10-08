// import mongoose from "mongoose";

// const commentSchema = new mongoose.Schema({
//   petition: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Petition',
//     required: true
//   },
//   author: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   content: {
//     type: String,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'in_progress', 'resolved'],
//     default: 'pending'
//   },
//   isOfficial: {
//     type: Boolean,
//     default: false
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   },
//   updatedAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// export default mongoose.model('Comment', commentSchema);

import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  petition: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Petition',
    required: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in_progress', 'resolved', 'active', 'under_review', 'closed'],
    default: 'pending'
  },
  isOfficial: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('Comment', commentSchema);