import Comment from '../models/Comment.js';
import Petition from '../models/Petition.js';

// Add a comment to a petition
export const addComment = async (req, res) => {
  try {
    const { petitionId } = req.params;
    const { content, status } = req.body;

    // Check if user is an official
    if (req.user.role !== 'official') {
      return res.status(403).json({ message: 'Only officials can comment on petitions' });
    }

    // Check if petition exists
    const petition = await Petition.findById(petitionId);
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // Check if official is assigned to the petition's location
    if (req.user.location !== petition.location) {
      return res.status(403).json({ 
        message: 'Officials can only comment on petitions in their assigned location' 
      });
    }

    const comment = await Comment.create({
      petition: petitionId,
      author: req.user._id,
      content,
      status,
      isOfficial: req.user.role === 'official'
    });

    // If comment is from an official and includes status, update petition status
    if (req.user.role === 'official' && status) {
      petition.status = status;
      await petition.save();
    }

    await comment.populate('author', 'name role');
    
    res.status(201).json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all comments for a petition
export const getComments = async (req, res) => {
  try {
    const { petitionId } = req.params;

    // First get the petition to check location
    const petition = await Petition.findById(petitionId);
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // If user is an official, check location authorization
    if (req.user.role === 'official' && req.user.location !== petition.location) {
      return res.status(403).json({ 
        message: 'Officials can only view petitions in their assigned location' 
      });
    }

    const comments = await Comment.find({ petition: petitionId })
      .populate('author', 'name role location')
      .sort('-createdAt');
      
    res.json(comments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a comment
export const updateComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const { content, status } = req.body;

    const comment = await Comment.findById(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is authorized to update
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update this comment' });
    }

    comment.content = content || comment.content;
    if (req.user.role === 'official') {
      comment.status = status || comment.status;
    }
    comment.updatedAt = Date.now();

    await comment.save();
    await comment.populate('author', 'name role');
    
    res.json(comment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a comment
export const deleteComment = async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is authorized to delete
    if (comment.author.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    await comment.remove();
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};