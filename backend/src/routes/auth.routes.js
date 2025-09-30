import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { preventCache } from "../middleware/cacheControl.js";

const router = Router();

// Apply cache control to all auth routes
router.use(preventCache);

// Helpers
const signToken = (user) => {
  const payload = { sub: user._id.toString(), role: user.role, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// POST /api/auth/register
router.post(
  "/register",
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
    body("password").isLength({ min: 6 }).withMessage("Password min 6 chars"),
    body("role").optional().isIn(["citizen", "official"]).withMessage("Invalid role"),
    body("location").optional().isString(),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, email, password, role = "citizen", location = "" } = req.body;

      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      const user = await User.create({ name, email, password: hashed, role, location });

      const token = signToken(user);
      // return token in JSON so frontend can store in localStorage
      res.status(201).json({
        message: "Registered successfully",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, location: user.location },
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/login
router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const ok = await bcrypt.compare(password, user.password);
      if (!ok) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      const token = signToken(user);
      res.json({
        message: "Logged in",
        token,
        user: { id: user._id, name: user.name, email: user.email, role: user.role, location: user.location },
      });
    } catch (err) {
      next(err);
    }
  }
);

// GET /api/auth/verify - Verify token and return user info
router.get("/verify", async (req, res) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        isValid: false, 
        message: "No token provided" 
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get fresh user data
    const user = await User.findById(decoded.sub).select("-password");
    if (!user) {
      return res.status(401).json({ 
        isValid: false, 
        message: "User not found" 
      });
    }

    // Return fresh token and user data
    const newToken = signToken(user);
    res.json({
      isValid: true,
      message: "Token is valid",
      token: newToken, // Return fresh token
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        location: user.location
      }
    });
  } catch (err) {
    res.status(401).json({ 
      isValid: false, 
      message: "Invalid or expired token" 
    });
  }
});

export default router;
