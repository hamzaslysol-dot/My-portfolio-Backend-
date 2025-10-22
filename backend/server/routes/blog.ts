// backend/server/routes/blog.ts
import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { db } from "../db";
import { eq } from "drizzle-orm";
import { blogs } from "../schema/blog";

const blogRouter = express.Router();

// -------------------- Multer config for file uploads --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../../uploads");
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueName = Date.now() + "-" + file.originalname;
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

// -------------------- Get all blogs --------------------
blogRouter.get("/", async (req, res) => {
  try {
    const allBlogs = await db.select().from(blogs);
    res.json(allBlogs);
  } catch (err) {
    console.error("❌ Error fetching blogs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------- Get a single blog --------------------
blogRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, Number(id)));
    if (!blog.length)
      return res.status(404).json({ message: "Blog not found" });
    res.json(blog[0]);
  } catch (err) {
    console.error("❌ Error fetching blog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------- Create a new blog --------------------
blogRouter.post("/", upload.single("image"), async (req, res) => {
  try {
    const { title, content, author } = req.body;
    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ message: "Title, content, and author are required" });
    }

    const imageUrl = req.file ? `/uploads/${req.file.filename}` : null;

    await db.insert(blogs).values({
      title,
      content,
      author,
      image: imageUrl,
    });

    res.status(201).json({ message: "Blog created successfully", imageUrl });
  } catch (err) {
    console.error("❌ Error creating blog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------- Update blog --------------------
blogRouter.put("/:id", upload.single("image"), async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, author } = req.body;

    const updateData: any = { title, content, author };
    if (req.file) updateData.image = `/uploads/${req.file.filename}`;

    const result = await db
      .update(blogs)
      .set(updateData)
      .where(eq(blogs.id, Number(id)));

    if (!result[0]?.affectedRows)
      return res.status(404).json({ message: "Blog not found" });

    res.json({ message: "Blog updated successfully" });
  } catch (err) {
    console.error("❌ Error updating blog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// -------------------- Delete blog --------------------
blogRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.delete(blogs).where(eq(blogs.id, Number(id)));

    if (!result[0]?.affectedRows)
      return res.status(404).json({ message: "Blog not found" });

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting blog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default blogRouter;
