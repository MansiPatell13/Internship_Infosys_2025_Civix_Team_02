import Petition from '../models/Petition.js';
import Comment from '../models/Comment.js';

// map petition status to comment status
const mapPetitionStatusToCommentStatus = (petitionStatus) => {
  const statusMap = {
    'active': 'in_progress',
    'under_review': 'in_progress',
    'closed': 'resolved'
  };
  return statusMap[petitionStatus] || 'pending';
};

// Get petitions by location for officials
export const getLocationPetitions = async (req, res) => {
  try {
    const { location } = req.user;
    
    if (req.user.role !== 'official') {
      return res.status(403).json({ message: 'Access denied. Officials only.' });
    }

    const petitions = await Petition.find({ location })
      .populate('creator', 'name email')
      .sort('-createdAt');

    res.json({
      location,
      total: petitions.length,
      active: petitions.filter(p => p.status === 'active').length,
      underReview: petitions.filter(p => p.status === 'under_review').length,
      closed: petitions.filter(p => p.status === 'closed').length,
      petitions
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update petition status
export const updatePetitionStatus = async (req, res) => {
  try {
    const { petitionId } = req.params;
    const { status, comment } = req.body;
    
    // Verify user is an official
    if (req.user.role !== 'official') {
      return res.status(403).json({ message: 'Access denied. Officials only.' });
    }

    // Get the petition
    const petition = await Petition.findById(petitionId);
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // Check if official has jurisdiction
    if (petition.location !== req.user.location) {
      return res.status(403).json({ 
        message: 'You can only manage petitions in your assigned location' 
      });
    }

    // Update petition status
    petition.status = status;
    await petition.save();

    // Add official comment if provided
    if (comment) {
      await Comment.create({
        petition: petitionId,
        author: req.user._id,
        content: comment,
        status: mapPetitionStatusToCommentStatus(status), // Map to valid comment status
        isOfficial: true
      });
    }

    res.json({
      message: 'Petition status updated successfully',
      petition
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Close petition
export const closePetition = async (req, res) => {
  try {
    const { petitionId } = req.params;
    const { reason } = req.body;
    
    // Verify user is an official
    if (req.user.role !== 'official') {
      return res.status(403).json({ message: 'Access denied. Officials only.' });
    }

    // Get the petition
    const petition = await Petition.findById(petitionId);
    if (!petition) {
      return res.status(404).json({ message: 'Petition not found' });
    }

    // Check if official has jurisdiction
    if (petition.location !== req.user.location) {
      return res.status(403).json({ 
        message: 'You can only manage petitions in your assigned location' 
      });
    }

    // Close the petition
    petition.status = 'closed';
    await petition.save();

    // Add closing comment with mapped status
    await Comment.create({
      petition: petitionId,
      author: req.user._id,
      content: reason || 'Petition closed by official',
      status: 'resolved', // Use valid comment status
      isOfficial: true
    });

    res.json({
      message: 'Petition closed successfully',
      petition
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};