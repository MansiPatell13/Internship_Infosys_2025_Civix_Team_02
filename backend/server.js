import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import  {connectDB} from "./src/config/db.js";
import authRoutes from "./src/routes/auth.routes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors()); // adjust origin in production
app.use(express.json());
app.use(morgan("dev"));

// Routes
app.get("/", (req, res) => res.json({ ok: true, service: "Civix Auth" }));
app.use("/api/auth", authRoutes);

// Start
const PORT = process.env.PORT || 4000;
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}).catch((err) => {
  console.error("Failed to connect DB:", err);
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
