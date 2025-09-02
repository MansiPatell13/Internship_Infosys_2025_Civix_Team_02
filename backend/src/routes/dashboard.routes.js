// routes/dashboardRoutes.js
import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// GET /api/dashboard
router.get("/", requireAuth, (req, res) => {
  res.json({
    message: `Welcome to your dashboard, ${req.user.name}`,
    user: req.user, // all details except password
  });
});

export default router;
