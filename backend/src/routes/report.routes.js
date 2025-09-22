import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Petition from "../models/Petition.js";
import Poll from "../models/poll.js";
import Vote from "../models/vote.js";
import PDFDocument from "pdfkit";   // for PDF export
import { Parser } from "json2csv";  // for CSV export

const router = Router();

/**
 * Customer Report Dashboard (full history)
 * GET /api/reports
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // All petitions by this user
    const petitions = await Petition.find({ createdBy: userId });

    // All polls by this user
    const polls = await Poll.find({ createdBy: userId });

    // All votes on this user’s polls
    const pollIds = polls.map((p) => p._id);
    const votes = await Vote.find({ pollId: { $in: pollIds } });

    // Stats
    const stats = {
      totalPetitions: petitions.length,
      activePetitions: petitions.filter((p) => p.status === "active").length,
      closedPetitions: petitions.filter((p) => p.status === "closed").length,
      totalPolls: polls.length,
      totalVotesOnPolls: votes.length,
    };

    res.json({
      reportPeriod: "full-history",
      user: {
        id: req.user._id,
        name: req.user.name,
        role: req.user.role,
      },
      stats,
      petitions,
      polls,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error generating report",
      error: error.message,
    });
  }
});

/**
 * Export Report (PDF or CSV, full history)
 * GET /api/reports/export?type=pdf
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

      doc.text(` Stats:`);
      doc.text(`Total Petitions: ${stats.totalPetitions}`);
      doc.text(`Active Petitions: ${stats.activePetitions}`);
      doc.text(`Closed Petitions: ${stats.closedPetitions}`);
      doc.text(`Total Polls: ${stats.totalPolls}`);
      doc.text(`Total Votes on Polls: ${stats.totalVotesOnPolls}`);
      doc.moveDown();

      doc.text(` Petitions:`);
      petitions.forEach((p) => {
        doc.text(`- ${p.title} [${p.status}]`);
      });
      doc.moveDown();

      doc.text(` Polls:`);
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

export default router;
