import Poll from '../models/poll.js';
import Vote from '../models/vote.js';

// Get polls by location for officials
export const getLocationPolls = async (req, res) => {
  try {
    const { location } = req.user;
    
    if (req.user.role !== 'official') {
      return res.status(403).json({ message: 'Access denied. Officials only.' });
    }

    const polls = await Poll.find({ target_location: location })
      .populate('createdBy', 'name email')
      .sort('-createdAt');

    // Get votes for these polls
    const pollIds = polls.map(poll => poll._id);
    const votes = await Vote.find({ pollId: { $in: pollIds } });

    const pollsWithStats = polls.map(poll => ({
      ...poll.toObject(),
      totalVotes: votes.filter(v => v.pollId.toString() === poll._id.toString()).length,
      // Calculate vote distribution
      options: poll.options.map(option => ({
        ...option,
        votes: votes.filter(v => 
          v.pollId.toString() === poll._id.toString() && 
          v.selected_option === option.text
        ).length
      }))
    }));

    res.json({
      location,
      total: polls.length,
      totalVotes: votes.length,
      averageVotesPerPoll: polls.length ? Math.round(votes.length / polls.length) : 0,
      polls: pollsWithStats
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new poll by official
export const createOfficialPoll = async (req, res) => {
  try {
    const { title, description, options } = req.body;
    
    // Verify user is an official
    if (req.user.role !== 'official') {
      return res.status(403).json({ message: 'Access denied. Officials only.' });
    }

    const poll = await Poll.create({
      title,
      description,
      options: options.map(opt => ({ text: opt })),
      createdBy: req.user._id,
      target_location: req.user.location,
      status: 'active',
      isOfficialPoll: true
    });

    await poll.populate('createdBy', 'name role');

    res.status(201).json({
      message: 'Official poll created successfully',
      poll
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Close poll
export const closePoll = async (req, res) => {
  try {
    const { pollId } = req.params;
    const { reason } = req.body;
    
    // Verify user is an official
    if (req.user.role !== 'official') {
      return res.status(403).json({ message: 'Access denied. Officials only.' });
    }

    // Get the poll
    const poll = await Poll.findById(pollId);
    if (!poll) {
      return res.status(404).json({ message: 'Poll not found' });
    }

    // Check if official has jurisdiction
    if (poll.target_location !== req.user.location) {
      return res.status(403).json({ 
        message: 'You can only manage polls in your assigned location' 
      });
    }

    // Close the poll
    poll.status = 'closed';
    poll.closedReason = reason || 'Closed by official';
    poll.closedAt = new Date();
    poll.closedBy = req.user._id;
    
    await poll.save();

    res.json({
      message: 'Poll closed successfully',
      poll
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};