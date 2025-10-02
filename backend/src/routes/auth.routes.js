import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import nodemailer from "nodemailer";
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

// Store for registration data and OTPs (better: use DB/Redis in production)
const registrationStore = new Map(); // email -> { userData, otp, expires }

// Helper function to generate OTP
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// POST /api/auth/register-init (Step 1: Initial registration and send OTP)
router.post(
  "/register-init",
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

      // Check if email is already registered
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ message: "Email already registered" });
      }

      // Generate 4-digit OTP
      const otp = generateOTP();

      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      // Store registration data with 5 min expiry
      registrationStore.set(email, {
        userData: { name, email, password: hashed, role, location },
        otp,
        expires: Date.now() + 5 * 60 * 1000
      });

      // Setup email transport (same as forgot password)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Send OTP mail (matching forgot password style)
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "Email Verification OTP - Civix",
        text: `Your email verification OTP is ${otp}. It will expire in 5 minutes.`,
      });

      res.json({ 
        message: "Verification code sent to your email",
        email 
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/register-verify (Step 2: Verify OTP and complete registration)
router.post(
  "/register-verify",
  [
    body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
    body("otp").isLength({ min: 4, max: 4 }).withMessage("Invalid OTP"),
  ],
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, otp } = req.body;
      const registration = registrationStore.get(email);

      // Validate OTP
      if (!registration || registration.expires < Date.now()) {
        return res.status(400).json({ message: "Invalid or expired OTP" });
      }

      if (registration.otp !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // Create user
      const user = await User.create(registration.userData);

      // Clean up registration data
      registrationStore.delete(email);

      // Generate token
      const token = signToken(user);

      res.status(201).json({
        message: "Registration successful",
        token,
        user: { 
          id: user._id, 
          name: user.name, 
          email: user.email, 
          role: user.role, 
          location: user.location 
        }
      });
    } catch (err) {
      next(err);
    }
  }
);

// POST /api/auth/resend-otp
router.post(
  "/resend-otp",
  [
    body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
  ],
  async (req, res, next) => {
    try {
      const { email } = req.body;
      const registration = registrationStore.get(email);

      if (!registration) {
        return res.status(404).json({ message: "No pending registration found" });
      }

      // Generate new OTP
      const newOtp = generateOTP();
      
      // Update registration data
      registration.otp = newOtp;
      registration.expires = Date.now() + 5 * 60 * 1000;
      registrationStore.set(email, registration);

      // Setup email transport (same as forgot password)
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASS,
        },
      });

      // Send new OTP mail (matching forgot password style)
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: email,
        subject: "New Verification OTP - Civix",
        text: `Your new verification OTP is ${newOtp}. It will expire in 5 minutes.`,
      });

      res.json({ 
        message: "New verification code sent",
        email 
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