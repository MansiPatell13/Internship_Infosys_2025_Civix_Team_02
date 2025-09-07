import express from "express";
import Petition from "../models/Petition.js";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

// Fix __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Absolute path for uploads folder
const uploadDir = path.join(__dirname, "../../uploads");

// Ensure uploads folder exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage config
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

// Create petition
router.post("/", requireAuth, upload.single("image"), async (req, res, next) => {
  try {
    const { title, description, category, location, signatureGoal } = req.body;

    const petition = new Petition({
      title,
      description,
      category,
      location,
      signatureGoal,
      image: req.file ? `/uploads/${req.file.filename}` : null, // public URL
      createdBy: req.user.id,
    });

    await petition.save();
    res.status(201).json(petition);
  } catch (err) {
    next(err);
  }
});

// Get petitions with filters
router.get("/", async (req, res, next) => {
  try {
    const { category, location, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (location) filter.location = location;
    if (status) filter.status = status;

    const petitions = await Petition.find(filter).populate(
      "createdBy",
      "name email"
    );
    res.json(petitions);
  } catch (err) {
    next(err);
  }
});

// Get single petition
router.get("/:id", async (req, res, next) => {
  try {
    const petition = await Petition.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );
    if (!petition) return res.status(404).json({ message: "Petition not found" });
    res.json(petition);
  } catch (err) {
    next(err);
  }
});

// Update petition
router.put("/:id", requireAuth, upload.single("image"), async (req, res, next) => {
  try {
    const updates = req.body;
    if (req.file) updates.image = `/uploads/${req.file.filename}`;

    const petition = await Petition.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    res.json(petition);
  } catch (err) {
    next(err);
  }
});

// Sign petition
router.post("/:id/sign", requireAuth, async (req, res, next) => {
  try {
    const petition = await Petition.findById(req.params.id);
    if (!petition) return res.status(404).json({ message: "Petition not found" });

    if (petition.signatures.includes(req.user.id)) {
      return res.status(400).json({ message: "Already signed" });
    }

    petition.signatures.push(req.user.id);
    await petition.save();

    res.json({
      message: "Signed successfully",
      totalSignatures: petition.signatures.length,
    });
  } catch (err) {
    next(err);
  }
});

export default router;