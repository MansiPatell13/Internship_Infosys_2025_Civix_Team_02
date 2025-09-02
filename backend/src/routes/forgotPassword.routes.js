import { Router } from "express";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import User from "../models/User.js";

const router = Router();

// Temporary OTP store (better: use DB or Redis for production)
const otpStore = new Map();

//  1. Forgot Password (send OTP to email)
router.post("/forgot-password", async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate 6-digit OTP
    const otp = crypto.randomInt(100000, 999999).toString();

    // Save OTP with 5 min expiry
    otpStore.set(email, { otp, expires: Date.now() + 5 * 60 * 1000 });

    // Setup email transport
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER, // your Gmail/SMTP user
        pass: process.env.SMTP_PASS, // your Gmail/SMTP password or app password
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

//  2. Reset Password (verify OTP and update password)
router.post("/reset-password", async (req, res, next) => {
  try {
    const { email, otp, newPassword } = req.body;

    const record = otpStore.get(email);
    if (!record || record.otp !== otp || record.expires < Date.now()) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(newPassword, salt);

    // Update password in DB
    await User.findOneAndUpdate({ email }, { password: hashed });

    // Remove OTP from store
    otpStore.delete(email);

    res.json({ message: "Password reset successful" });
  } catch (err) {
    next(err);
  }
});

export default router;
