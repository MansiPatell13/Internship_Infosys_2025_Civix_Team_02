import express from "express";
import { body, validationResult } from "express-validator";
import Poll from "../models/poll.js";
import Vote from "../models/vote.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post(
  "/",
  requireAuth,
  [
    body("title").notEmpty().withMessage("Title is required"),
    body("description").notEmpty().withMessage("Description is required"),
    body("options")
      .isArray({ min: 2 })
      .withMessage("At least 2 options are required"),
    body("closesOn").isISO8601().withMessage("Valid closing date is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(400).json({ errors: errors.array() });

    try {
      if (req.user.role !== "citizen") {
        return res
          .status(403)
          .json({ message: "Only citizens can create polls" });
      }

      const poll = new Poll({
        ...req.body,
        createdBy: req.user._id,
      });

      await poll.save();
      res.status(201).json(poll);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }
);

/**
 *  Get Poll List (citizens + officials can view)
 * Optional filters: ?location=CityName&createdBy=userId&page=1&limit=10
 */
router.get("/list", requireAuth, async (req, res) => {
  try {
    const { location, createdBy, page = 1, limit = 10 } = req.query;

    const filter = {};
    if (location) filter.targetLocation = location;
    if (createdBy) filter.createdBy = createdBy;

    const polls = await Poll.find(filter)
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const totalCount = await Poll.countDocuments(filter);

    res.json({
      count: polls.length,
      totalCount,
      page: parseInt(page),
      polls,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 *  Get Poll Details (with aggregated votes)
 */
router.get("/:id", requireAuth, async (req, res) => {
  try {
    const poll = await Poll.findById(req.params.id).populate(
      "createdBy",
      "name email role"
    );
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // Aggregate votes
    const votes = await Vote.find({ pollId: poll._id });
    const results = {};

    poll.options.forEach((opt, i) => {
      results[opt.text] = votes.filter((v) => v.selectedOption === i.toString())
        .length;
    });

    res.json({ poll, results, totalVotes: votes.length });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 *  Vote on Poll (citizens only, one vote per poll)
 */
router.post("/:id/vote", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "citizen") {
      return res
        .status(403)
        .json({ message: "Only citizens can vote on polls" });
    }

    const { selectedOption } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // Check poll expiry
    if (new Date() > new Date(poll.closesOn)) {
      return res.status(400).json({ error: "Poll has already closed" });
    }

    // Prevent duplicate voting
    const existingVote = await Vote.findOne({
      pollId: poll._id,
      userId: req.user._id,
    });
    if (existingVote) {
      return res
        .status(400)
        .json({ error: "You have already voted on this poll" });
    }

    // Record vote
    const vote = new Vote({
      pollId: poll._id,
      userId: req.user._id,
      selectedOption,
    });
    await vote.save();

    // Atomic increment of vote count
    if (poll.options[selectedOption]) {
      await Poll.updateOne(
        { _id: poll._id, "options._id": poll.options[selectedOption]._id },
        { $inc: { "options.$.votes": 1 } }
      );
    }

    res.json({ message: "Vote recorded", poll });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
