import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { connectDB } from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import forgotPasswordRoutes from "./src/routes/forgotPassword.routes.js";
import petitionRoutes from "./src/routes/petition.routes.js";

dotenv.config();

const app = express();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors()); // adjust origin in production
app.use(express.json());
app.use(morgan("dev"));

//  Serve static uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));



// Routes
app.use("/api/petitions", petitionRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/auth", forgotPasswordRoutes);

app.get("/", (req, res) => res.json({ ok: true, service: "Civix Auth" }));

// Start
const PORT = process.env.PORT || 4000;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(` Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error(" Failed to connect DB:", err);
    process.exit(1);
  });

// Error handler (last)
app.use((err, _req, res, _next) => {
  const status = err.status || 500;
  const message = err.message || "Server error";
  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }
  res.status(status).json({ message });
});
