// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./src/config/db.js";

// Routes
import authRoutes from "./src/routes/auth.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import forgotPasswordRoutes from "./src/routes/forgotPassword.routes.js";
import petitionRoutes from "./src/routes/petition.routes.js";
import pollRoutes from "./src/routes/poll.routes.js"; // Added poll routes

const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

// Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/petitions", petitionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", forgotPasswordRoutes);
app.use("/api/polls", pollRoutes); //  New Poll APIs route

// Health check route
app.get("/", (req, res) => res.json({ ok: true, service: "Civix Backend" }));

// Start server
const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    console.log(" MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Failed to connect DB:", err);
    process.exit(1);
  });

// Global error handler
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";
  if (process.env.NODE_ENV !== "production") console.error(err);
  res.status(status).json({ message });
});
