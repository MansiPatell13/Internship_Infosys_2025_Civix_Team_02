import express from 'express';
import { auth } from '../middleware/auth.js';
import { isOfficial } from '../middleware/role.js';
import {
  addComment,
  getComments,
  updateComment,
  deleteComment
} from '../controllers/comment.controller.js';

const router = express.Router();

// All routes require authentication
router.use(auth);

// Add comment to petition (officials only)
router.post('/petition/:petitionId', isOfficial, addComment);

// Get all comments for a petition
router.get('/petition/:petitionId', getComments);

// Update a comment
router.put('/:commentId', updateComment);

// Delete a comment
router.delete('/:commentId', deleteComment);

export default router;