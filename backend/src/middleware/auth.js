import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Token refresh threshold (1 hour before expiry)
const REFRESH_THRESHOLD = 60 * 60; 

// Helper to sign new token
const signToken = (user) => {
  const payload = { sub: user._id.toString(), role: user.role, email: user.email };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// Check if token needs refresh
const shouldRefreshToken = (decoded) => {
  const now = Math.floor(Date.now() / 1000);
  const exp = decoded.exp;
  return exp - now < REFRESH_THRESHOLD;
};

export const auth = async (req, res, next) => {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) {
    return next({ status: 401, message: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    next({ status: 401, message: "Invalid or expired token" });
  }
};

export const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ 
        message: "No token provided",
        redirectTo: "/login"
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get fresh user data
    const user = await User.findById(decoded.sub).select("-password");
    if (!user) {
      return res.status(401).json({ 
        message: "User not found",
        redirectTo: "/login"
      });
    }

    // Attach user to request
    req.user = user;

    // Check if token should be refreshed
    if (shouldRefreshToken(decoded)) {
      const newToken = signToken(user);
      // Set the new token in response header
      res.set('X-New-Token', newToken);
    }

    next();
  } catch (err) {
    res.status(401).json({ 
      message: "Invalid or expired token",
      redirectTo: "/login"
    });
  }
};

