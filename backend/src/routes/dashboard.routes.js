 // /routes/dashboard.routes.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import Petition from "../models/Petition.js";
import Poll from "../models/poll.js";

const router = Router();

/**
 * 📊 Dashboard Stats
 * GET /api/dashboard
 */
router.get("/", requireAuth, async (req, res) => {
  try {
    // 📊 Total counts
    const totalPetitions = await Petition.countDocuments();
    const totalPolls = await Poll.countDocuments();

    // 📊 Active engagement (petitions + polls)
    const activePetitions = await Petition.countDocuments({ status: "active" });
    const activePolls = await Poll.countDocuments({ status: "active" });

    const activeEngagements = activePetitions + activePolls;

    res.json({
      message: `Welcome to your dashboard, ${req.user.name}`,
      user: req.user,
      stats: {
        petitions: totalPetitions,
        polls: totalPolls,
        activeEngagements: activeEngagements
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
