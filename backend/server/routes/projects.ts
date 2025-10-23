import express from "express";
import { db } from "../db";
import { projects } from "../db/schema";
import { eq } from "drizzle-orm"; // ✅ import eq
import multer from "multer";
import path from "path";
import fs from "fs";

const router = express.Router();

// Multer setup (unchanged)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = "uploads/projects";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});
const upload = multer({ storage });

// GET all projects
router.get("/", async (req, res) => {
  try {
    const allProjects = await db.select().from(projects);
    res.json(allProjects);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// GET single project by ID
router.get("/:id", async (req, res) => {
  try {
    const id = Number(req.params.id);
    const project = await db.select().from(projects).where(eq(projects.id, id)); // ✅ use eq() function
    if (!project.length)
      return res.status(404).json({ message: "Project not found" });
    res.json(project[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch project" });
  }
});

// POST create new project
router.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, link } = req.body;
    const image = req.file ? req.file.path.replace(/\\/g, "/") : "";
    const [newProject] = await db
      .insert(projects)
      .values({ title, link, image });
    res.status(201).json(newProject);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to create project" });
  }
});

// PUT update project
router.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const id = Number(req.params.id);
    const { title, link } = req.body;
    const updateData: any = { title, link };

    if (req.file) updateData.image = req.file.path.replace(/\\/g, "/");

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
