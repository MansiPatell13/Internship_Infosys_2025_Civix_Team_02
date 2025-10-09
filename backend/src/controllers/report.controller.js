import Report from '../models/Report.js';
import Petition from '../models/Petition.js';
import Poll from '../models/poll.js';
import Vote from '../models/vote.js';

// Generate a New report
export const generateReport = async (req, res) => {
  try {
    const { type, location, startDate, endDate } = req.body;
    
    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    if (end < start) {
      return res.status(400).json({ message: 'End date must be after start date' });
    }

    // Gather metrics
    const [
      totalPetitions,
      activePetitions,
      resolvedPetitions,
      totalPolls,
      totalVotes
    ] = await Promise.all([
      Petition.countDocuments({ 
        location,
        createdAt: { $gte: start, $lte: end }
      }),
      Petition.countDocuments({ 
        location,
        status: 'active',
        createdAt: { $gte: start, $lte: end }
      }),
      Petition.countDocuments({ 
        location,
        status: 'closed',
        createdAt: { $gte: start, $lte: end }
      }),
      Poll.countDocuments({
        target_location: location,
        createdAt: { $gte: start, $lte: end }
      }),
      Vote.countDocuments({
        createdAt: { $gte: start, $lte: end }
      })
    ]);

    // Calculate engagement rate
    const engagementRate = ((totalVotes + totalPetitions) / (activePetitions + totalPolls)) * 100;

    // Generate summary
    const summary = `From ${start.toLocaleDateString()} to ${end.toLocaleDateString()}, 
                     there were ${totalPetitions} petitions created (${activePetitions} active, 
                     ${resolvedPetitions} resolved) and ${totalPolls} polls conducted with 
                     ${totalVotes} total votes cast in ${location}.`;

    const report = await Report.create({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Civic Engagement Report - ${location}`,
      type,
      period: { startDate: start, endDate: end },
      location,
      metrics: {
        totalPetitions,
        activePetitions,
        resolvedPetitions,
        totalPolls,
        totalVotes,
        engagementRate: Math.round(engagementRate * 100) / 100
      },
      summary,
      generatedBy: req.user._id
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all reports
export const getReports = async (req, res) => {
  try {
    const { location } = req.query;
    const query = location ? { location } : {};
    
    const reports = await Report.find(query)
      .populate('generatedBy', 'name email role')
      .sort('-createdAt');
      
    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a single report by ID
export const getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id)
      .populate('generatedBy', 'name email role');
      
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a report
export const deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user is authorized to delete
    if (report.generatedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }
    
    await report.remove();
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};