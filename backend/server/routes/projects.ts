import express from "express";
import { db } from "../db";
import { projects } from "../db/schema";
import { eq } from "drizzle-orm"; // ✅ import eq
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// -------------------- Multer config for file uploads --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../projects_uploads");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// -------------------- Get all projects --------------------
router.get("/", async (req, res) => {
  try {
    const allProjects = await db.select().from(projects);
    res.json(allProjects);
  } catch (err) {
    console.error("❌ Error fetching projects:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// GET single project by ID
// router.get("/:id", async (req, res) => {
//   try {
//     const id = Number(req.params.id);
//     const project = await db.select().from(projects).where(eq(projects.id, id)); // ✅ use eq() function
//     if (!project.length)
//       return res.status(404).json({ message: "Project not found" });
//     res.json(project[0]);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Failed to fetch project" });
//   }
// });

// -------------------- Create a new project --------------------
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, link } = req.body;
    if (!title || !link) {
      return res.status(400).json({ message: "Title and link are required" });
    }

    const imageUrl = req.file ? `/projects_uploads/${req.file.filename}` : null;

    await db.insert(projects).values({
      title,
      link,
      image: imageUrl,
    });

    res.status(201).json({ message: "Blog created successfully", imageUrl });
  } catch (err) {
    console.error("❌ Error creating blog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------- Update project --------------------
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, link } = req.body;
    const updateData: any = { title, link };

    if (req.file) updateData.image = `/projects_uploads/${req.file.filename}`;

    const [updatedProject] = await db
      .update(projects)
      .set(updateData)
      .where(eq(projects.id, id)); // ✅ use eq() function

    if (!updatedProject)
      return res.status(404).json({ message: "Project not found" });
    res.json(updatedProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update project" });
  }
});

// DELETE project
router.delete("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const deleted = await db.delete(projects).where(eq(projects.id, id)); // ✅ use eq() function
    if (!deleted.length)
      return res.status(404).json({ message: "Project not found" });
    res.json({ message: "Project deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete project" });
  }
});

export default router;
