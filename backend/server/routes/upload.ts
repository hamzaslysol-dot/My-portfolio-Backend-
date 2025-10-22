import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// ------------------- Blog Images -------------------
const uploadsDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const blogStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const uploadBlog = multer({ storage: blogStorage });

// Route: Upload blog image
router.post("/blog", uploadBlog.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const imageUrl = `http://localhost:8000/uploads/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error("❌ Blog upload error:", error);
    res.status(500).json({ error: "Failed to upload blog image" });
  }
});

// ------------------- Profile Images -------------------
const profilesDir = path.join(__dirname, "../profiles");
if (!fs.existsSync(profilesDir)) {
  fs.mkdirSync(profilesDir, { recursive: true });
}

const profileStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, profilesDir);
  },
  filename: (_req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const uploadProfile = multer({ storage: profileStorage });

// Route: Upload profile image
router.post("/profile", uploadProfile.single("image"), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    const imageUrl = `http://localhost:8000/profiles/${req.file.filename}`;
    res.json({ url: imageUrl });
  } catch (error) {
    console.error("❌ Profile upload error:", error);
    res.status(500).json({ error: "Failed to upload profile image" });
  }
});

export default router;
