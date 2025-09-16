// Load environment variables first
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import mongoose from "mongoose";
import multer from "multer";
import Petition from "../models/Petition.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

//  MONGODB 
const mongoURI = process.env.MONGO_URI;
if (!mongoURI) throw new Error("MONGO_URI is not defined in .env");

const conn = mongoose.createConnection(mongoURI, {
  dbName: process.env.MONGO_DB || "civix",
});

conn.once("open", () => {
  console.log(" MongoDB connected successfully");
});

//   MULTER (Memory Storage) 
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ROUTES 

// Create petition
router.post("/", requireAuth, upload.single("image"), async (req, res, next) => {
  try {
    let fileId = null;
    if (req.file) {
      const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });
      uploadStream.end(req.file.buffer);
      fileId = uploadStream.id;
    }

    const { title, description, category, location, signatureGoal } = req.body;
    const petition = new Petition({
      title,
      description,
      category,
      location,
      signatureGoal,
      image: fileId,
      createdBy: req.user.id,
    });

    await petition.save();
    res.status(201).json(petition);
  } catch (err) {
    next(err);
  }
});

// Get all petitions
router.get("/", async (req, res, next) => {
  try {
    const { category, location, status } = req.query;
    const filter = {};
    if (category) filter.category = category;
    if (location) filter.location = location;
    if (status) filter.status = status;

    const petitions = await Petition.find(filter).populate("createdBy", "name email");
    res.json(petitions);
  } catch (err) {
    next(err);
  }
});

// Get single petition
router.get("/:id", async (req, res, next) => {
  try {
    const petition = await Petition.findById(req.params.id).populate("createdBy", "name email");
    if (!petition) return res.status(404).json({ message: "Petition not found" });
    res.json(petition);
  } catch (err) {
    next(err);
  }
});

// Update petition
router.put("/:id", requireAuth, upload.single("image"), async (req, res, next) => {
  try {
    const updates = { ...req.body };

    if (req.file) {
      const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });
      const uploadStream = bucket.openUploadStream(req.file.originalname, {
        contentType: req.file.mimetype,
      });
      uploadStream.end(req.file.buffer);
      updates.image = uploadStream.id;
    }

    const petition = await Petition.findByIdAndUpdate(req.params.id, updates, { new: true });
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

// Serve image by GridFS ID
router.get("/image/:id", async (req, res, next) => {
  try {
    const fileId = new mongoose.Types.ObjectId(req.params.id);
    const bucket = new mongoose.mongo.GridFSBucket(conn.db, { bucketName: "uploads" });

    const files = await bucket.find({ _id: fileId }).toArray();
    if (!files || files.length === 0) return res.status(404).json({ message: "File not found" });

    res.set("Content-Type", files[0].contentType || "image/jpeg");
    bucket.openDownloadStream(fileId).pipe(res);
  } catch (err) {
    next(err);
  }
});

export default router;
