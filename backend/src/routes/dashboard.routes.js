// /routes/dashboard.routes.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { isOfficial } from "../middleware/role.js";
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

        // Different stats for officials and citizens
    let stats = {};
    
    if (req.user.role === 'official') {
      // For officials, show petitions and polls in their location
      const locationPetitions = await Petition.find({ location: req.user.location })
        .populate('creator', 'name email')
        .sort('-createdAt');
      
      const locationPolls = await Poll.find({ target_location: req.user.location })
        .populate('createdBy', 'name email')
        .sort('-createdAt');

      // Active engagements for official's location
      const activePetitions = locationPetitions.filter(p => p.status === 'active');
      const activePolls = locationPolls.filter(p => p.status === 'active');

      stats = {
        location: req.user.location,
        petitions: {
          total: locationPetitions.length,
          active: activePetitions.length,
          underReview: locationPetitions.filter(p => p.status === 'under_review').length,
          closed: locationPetitions.filter(p => p.status === 'closed').length,
          recentPetitions: locationPetitions.slice(0, 5) // Last 5 petitions
        },
        polls: {
          total: locationPolls.length,
          active: activePolls.length,
          closed: locationPolls.filter(p => p.status === 'closed').length,
          recentPolls: locationPolls.slice(0, 5) // Last 5 polls
        },
        activeEngagements: activePetitions.length + activePolls.length
      };
    } else {
      // For citizens, show their own petitions and polls
      const userPetitions = await Petition.find({ creator: userId }).sort('-createdAt');
      const userPolls = await Poll.find({ createdBy: userId }).sort('-createdAt');

      // Active engagements for citizen
      const activePetitions = userPetitions.filter(p => p.status === 'active');
      const activePolls = userPolls.filter(p => p.status === 'active');

      stats = {
        petitions: {
          total: userPetitions.length,
          active: activePetitions.length,
          recentPetitions: userPetitions.slice(0, 5) // Last 5 petitions
        },
        polls: {
          total: userPolls.length,
          active: activePolls.length,
          recentPolls: userPolls.slice(0, 5) // Last 5 polls
        },
        activeEngagements: activePetitions.length + activePolls.length
      };
    }

    res.json({
      message: `Welcome to your dashboard, ${req.user.name}`,
      user: {
        id: req.user._id,
        name: req.user.name,
        email: req.user.email,
        role: req.user.role,
        location: req.user.location
      },
      stats
    });

  } catch (error) {
    res.status(500).json({
      message: "Error fetching dashboard stats",
      error: error.message
    });
  }
});

export default router;
