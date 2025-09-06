import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = Router();

// Temporary OTP + verified sessions (better: use DB/Redis in production)
const otpStore = new Map();        // otp -> { email, expires }
const verifiedSessions = new Map(); // sessionId -> email

// 1. Forgot Password (send OTP to email)
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 4-digit OTP
    const otp = crypto.randomInt(1000, 9999).toString();

    // Save OTP with 5 min expiry (keyed by otp, not email)
    otpStore.set(otp, { email, expires: Date.now() + 5 * 60 * 1000 });

    // Setup email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // Send OTP mail
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    });

    res.json({ message: "OTP sent to email" });
  } catch (err) {
    next(err);
  }
});

// 2. Verify OTP (only otp required)
router.post("/verify-otp", (req, res) => {
  const { otp } = req.body;

  const record = otpStore.get(otp);
  if (!record || record.expires < Date.now()) {
    return res.status(400).json({ message: "Invalid or expired OTP" });
  }

  // Create a temporary session
  const sessionId = crypto.randomBytes(16).toString("hex");
  verifiedSessions.set(sessionId, record.email);

  // Remove OTP (to prevent reuse)
  otpStore.delete(otp);

  res.json({ message: "OTP verified successfully", sessionId });
});

// 3. Reset Password (only needs new password + sessionId)
router.post("/reset-password", async (req, res, next) => {
  try {
    const { sessionId, newPassword } = req.body;

    const email = verifiedSessions.get(sessionId);
    if (!email) {
      return res.status(403).json({ message: "OTP verification required" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    // Update password in DB
    await User.findOneAndUpdate({ email }, { password: hashed });

    // Remove from verified sessions
    verifiedSessions.delete(sessionId);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
});

export default router;