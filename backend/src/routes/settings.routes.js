import { Router } from "express";
import bcrypt from "bcryptjs";
import { body, validationResult } from "express-validator";
import User from "../models/User.js";

const router = Router();

// Standardized error response helper
const sendError = (res, status, message, errors = null) => {
  console.error(`[Settings Error] ${message}`, errors || '');
  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

// Standardized success response helper
const sendSuccess = (res, data, message = 'Operation successful') => {
  console.log(`[Settings Success] ${message}`);
  res.json({
    success: true,
    message,
    ...data
  });
};

// GET /api/user/settings - Get user settings
router.get("/", async (req, res) => {
  try {
    console.log(`[Settings] Getting settings for user ${req.user._id}`);
    const user = await User.findById(req.user._id).select("-password");
    
    if (!user) {
      return sendError(res, 404, "User not found");
    }

    sendSuccess(res, { user });
  } catch (error) {
    console.error("[Settings Error] Failed to fetch settings:", error);
    sendError(res, 500, "Error fetching user settings");
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
        return sendError(res, 400, "Validation failed", errors.array());
      }

      console.log(`[Settings] Updating settings for user ${req.user._id}`, req.body);
      const { name, email, location } = req.body;
      const updates = {};

      // Only add fields that are provided
      if (name) updates.name = name;
      if (location) updates.location = location;
      
      // Handle email update separately (check for duplicates)
      if (email && email !== req.user.email) {
        console.log(`[Settings] Checking email availability: ${email}`);
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return sendError(res, 400, "Email already in use");
        }
        updates.email = email;
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updates },
        { new: true }
      ).select("-password");

      if (!user) {
        return sendError(res, 404, "User not found");
      }

      console.log(`[Settings] Successfully updated settings for user ${req.user._id}`);
      sendSuccess(res, { user }, "Settings updated successfully");
    } catch (error) {
      console.error("[Settings Error] Failed to update settings:", error);
      sendError(res, 500, "Error updating settings");
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
        return sendError(res, 400, "Validation failed", errors.array());
      }

      console.log(`[Settings] Attempting password change for user ${req.user._id}`);
      const { currentPassword, newPassword } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id);
      if (!user) {
        return sendError(res, 404, "User not found");
      }
      
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        console.log(`[Settings] Invalid current password attempt for user ${req.user._id}`);
        return sendError(res, 401, "Current password is incorrect");
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password
      user.password = hashedPassword;
      await user.save();

      console.log(`[Settings] Successfully updated password for user ${req.user._id}`);
      sendSuccess(res, {}, "Password updated successfully");
    } catch (error) {
      console.error("[Settings Error] Failed to update password:", error);
      sendError(res, 500, "Error updating password");
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
        return sendError(res, 400, "Validation failed", errors.array());
      }

      console.log(`[Settings] Attempting account deletion for user ${req.user._id}`);
      const { password } = req.body;

      // Get user with password
      const user = await User.findById(req.user._id);
      if (!user) {
        return sendError(res, 404, "User not found");
      }
      
      // Verify password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        console.log(`[Settings] Invalid password attempt during account deletion for user ${req.user._id}`);
        return sendError(res, 401, "Invalid password");
      }

      // Delete user
      await User.findByIdAndDelete(req.user._id);

      console.log(`[Settings] Successfully deleted account for user ${req.user._id}`);
      sendSuccess(res, {}, "Account deleted successfully");
    } catch (error) {
      console.error("[Settings Error] Failed to delete account:", error);
      sendError(res, 500, "Error deleting account");
    }
  }
);

export default router;