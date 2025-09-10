import express from "express";
import Poll from "../models/poll.js";
import Vote from "../models/vote.js";
import { auth, requireAuth } from "../middleware/auth.js";

const router = express.Router();

// ✅ Create Poll (only citizens)
router.post("/", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "citizen") {
      return res.status(403).json({ message: "Only citizens can create polls" });
    }

    const poll = new Poll({
      ...req.body,
      createdBy: req.user._id, // attach creator
    });

    await poll.save();
    res.status(201).json(poll);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get All Polls (citizens + officials can view)
router.get("/", requireAuth, async (req, res) => {
  try {
    const polls = await Poll.find();
    res.json(polls);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Vote on Poll (citizens only)
router.post("/:id/vote", requireAuth, async (req, res) => {
  try {
    if (req.user.role !== "citizen") {
      return res.status(403).json({ message: "Only citizens can vote on polls" });
    }

    const { selectedOption } = req.body;
    const poll = await Poll.findById(req.params.id);
    if (!poll) return res.status(404).json({ error: "Poll not found" });

    // Record vote
    const vote = new Vote({
      pollId: poll._id,
      userId: req.user.id,
      selectedOption,
    });
    await vote.save();

    // Update vote count
    poll.options[selectedOption].votes += 1;
    await poll.save();

    res.json({ message: "Vote recorded", poll });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

export default router;
