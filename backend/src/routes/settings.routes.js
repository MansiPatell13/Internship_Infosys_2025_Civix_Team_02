import { Router } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

// Apply auth middleware to all settings routes
router.use(requireAuth);

// GET /api/user/settings - Get user settings
router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user settings" });
  }
});

// PUT /api/user/settings - Update user settings
router.put("/",
  [
    body("name").optional().trim().notEmpty().withMessage("Name cannot be empty"),
    body("email").optional().isEmail().withMessage("Invalid email format"),
    body("location").optional().trim().notEmpty().withMessage("Location cannot be empty"),
    // Note: role cannot be changed through settings
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { name, email, location } = req.body;
      const updates = {};

      // Only add fields that are provided
      if (name) updates.name = name;
      if (location) updates.location = location;
      
      // Handle email update separately (check for duplicates)
      if (email && email !== req.user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({ message: "Email already in use" });
        }
        updates.email = email;
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true }
      ).select("-password");

      res.json({
        message: "Settings updated successfully",
        user
      });
    } catch (error) {
      res.status(500).json({ message: "Error updating settings" });
    }
  }
);

// PUT /api/user/settings/password - Change password
router.put("/password",
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    body("newPassword")
      .isLength({ min: 6 })
      .withMessage("New password must be at least 6 characters long")
      .not()
      .equals(body("currentPassword"))
      .withMessage("New password must be different from current password"),
    body("confirmPassword")
      .custom((value, { req }) => {
        if (value !== req.body.newPassword) {
          throw new Error("Password confirmation does not match");
        }
        return true;
      })
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id);
      
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Current password is incorrect" });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      user.password = hashedPassword;
      await user.save();

      res.json({ message: "Password updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error updating password" });
    }
  }
);

// DELETE /api/user/settings - Delete account
router.delete("/",
  [
    body("password").notEmpty().withMessage("Password is required to delete account")
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { password } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id);
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid password" });
      }

      // Delete user
      await User.findByIdAndDelete(req.user._id);

      res.json({ message: "Account deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error deleting account" });
    }
  }
);

export default router;