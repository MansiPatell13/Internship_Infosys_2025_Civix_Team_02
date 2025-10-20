import { Router } from "express";
import { auth } from "./auth.js";

const router = Router();

router.get("/me", auth, (req, res) => {
  res.json({ message: "Your profile", user: req.user });
});

export default router;