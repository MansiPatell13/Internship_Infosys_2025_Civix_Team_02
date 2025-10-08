import { Router } from "express";
import { requireAuth } from '../middleware/auth.js';
import { isOfficial } from '../middleware/role.js';
import Petition from "../models/Petition.js";
import Poll from "../models/poll.js";
import Vote from "../models/vote.js";
import Report from "../models/Report.js";
import PDFDocument from "pdfkit";   // for PDF export
import { Parser } from "json2csv";  // for CSV export

const router = Router();

/**
 * Export Report (PDF or CSV, for citizens - full history of their own data)
 * GET /api/reports/export?type=pdf
 * NOTE: This must come BEFORE other routes to avoid being caught by /:id
 */
router.get("/export", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;
    const { type = "pdf" } = req.query;

    const petitions = await Petition.find({ createdBy: userId });
    const polls = await Poll.find({ createdBy: userId });
    const pollIds = polls.map((p) => p._id);
    const votes = await Vote.find({ pollId: { $in: pollIds } });

    const stats = {
      totalPetitions: petitions.length,
      activePetitions: petitions.filter((p) => p.status === "active").length,
      closedPetitions: petitions.filter((p) => p.status === "closed").length,
      totalPolls: polls.length,
      totalVotesOnPolls: votes.length,
    };

    if (type === "pdf") {
      // PDF Export
      const doc = new PDFDocument();
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=report-full.pdf`
      );
      doc.pipe(res);

      doc.fontSize(20).text(`Civic Engagement Report`, { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`User: ${req.user.name}`);
      doc.text(`Period: Full history`);
      doc.moveDown();

      doc.text(`Stats:`);
      doc.text(`Total Petitions: ${stats.totalPetitions}`);
      doc.text(`Active Petitions: ${stats.activePetitions}`);
      doc.text(`Closed Petitions: ${stats.closedPetitions}`);
      doc.text(`Total Polls: ${stats.totalPolls}`);
      doc.text(`Total Votes on Polls: ${stats.totalVotesOnPolls}`);
      doc.moveDown();

      doc.text(`Petitions:`);
      petitions.forEach((p) => {
        doc.text(`- ${p.title} [${p.status}]`);
      });
      doc.moveDown();

      doc.text(`Polls:`);
      polls.forEach((p) => {
        doc.text(`- ${p.title} (${p.options.length} options)`);
      });

      doc.end();
    } else if (type === "csv") {
      // CSV Export
      const parser = new Parser();
      const csv = parser.parse({
        stats,
        petitions,
        polls,
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=report-full.csv`
      );
      res.send(csv);
    } else {
      res.status(400).json({ error: "Invalid export type. Use pdf or csv." });
    }
  } catch (error) {
    res.status(500).json({
      message: "Error exporting report",
      error: error.message,
    });
  }
});

/**
 * Generate a new report (for officials)
 * POST /api/reports/generate
 */
router.post("/generate", requireAuth, isOfficial, async (req, res) => {
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
      petitions,
      activePetitions,
      closedPetitions,
      polls,
      pollVotes
    ] = await Promise.all([
      Petition.find({ 
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
      Poll.find({
        target_location: location,
        createdAt: { $gte: start, $lte: end }
      }),
      Vote.countDocuments({
        createdAt: { $gte: start, $lte: end }
      })
    ]);

    const totalPetitions = petitions.length;
    const totalPolls = polls.length;
    const totalSignatures = petitions.reduce((sum, p) => sum + (p.signatures?.length || 0), 0);

    // Calculate engagement rate
    const totalItems = activePetitions + totalPolls;
    const engagementRate = totalItems > 0 
      ? ((pollVotes + totalSignatures) / totalItems) * 100 
      : 0;

    // Generate summary
    const summary = `From ${start.toLocaleDateString()} to ${end.toLocaleDateString()}, there were ${totalPetitions} petitions created (${activePetitions} active, ${closedPetitions} resolved) and ${totalPolls} polls conducted with ${pollVotes} total votes cast in ${location}. Total engagement: ${totalSignatures} petition signatures.`;

    const report = await Report.create({
      title: `${type.charAt(0).toUpperCase() + type.slice(1)} Civic Engagement Report - ${location}`,
      type,
      period: { startDate: start, endDate: end },
      location,
      metrics: {
        totalPetitions,
        activePetitions,
        resolvedPetitions: closedPetitions,
        totalSignatures,
        totalPolls,
        totalVotes: pollVotes,
        engagementRate: Math.round(engagementRate * 100) / 100
      },
      summary,
      generatedBy: req.user._id
    });

    res.status(201).json(report);
  } catch (error) {
    console.error('Error generating report:', error);
    res.status(500).json({ message: error.message });
  }
});

/**
 * Get all reports (filtered by location for officials)
 * GET /api/reports
 */
router.get("/", requireAuth, isOfficial, async (req, res) => {
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
});

/**
 * Get a single report by ID
 * GET /api/reports/:id
 */
router.get("/:id", requireAuth, isOfficial, async (req, res) => {
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
});

/**
 * Delete a report
 * DELETE /api/reports/:id
 */
router.delete("/:id", requireAuth, isOfficial, async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    // Check if user is authorized to delete
    if (report.generatedBy.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this report' });
    }
    
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: 'Report deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;