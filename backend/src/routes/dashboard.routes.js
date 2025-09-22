// /routes/dashboard.routes.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Petition from "../models/Petition.js";
import Poll from "../models/poll.js";

const router = Router();

/**
 *  Dashboard Stats
 *  GET /api/dashboard
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Count only the user's own petitions and polls
    const totalPetitions = await Petition.countDocuments({ createdBy: userId });
    const totalPolls = await Poll.countDocuments({ createdBy: userId });

    // Active engagements (user's active petitions + polls)
    const activePetitions = await Petition.countDocuments({ createdBy: userId, status: "active" });
    const activePolls = await Poll.countDocuments({ createdBy: userId, status: "active" });

    const activeEngagements = activePetitions + activePolls;

    res.json({
      message: `Welcome to your dashboard, ${req.user.name}`,
      user: req.user,
      stats: {
        petitions: totalPetitions,
        polls: totalPolls,
        activeEngagements
      }
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message
    });
  }
});

export default router;
