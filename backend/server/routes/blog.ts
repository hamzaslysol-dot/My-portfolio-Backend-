// backend/server/routes/blog.ts
import express from "express";
import { db } from "../db.ts";
import { eq } from "drizzle-orm";
import { blogs } from "../schema/blog.ts"; // adjust path if needed

const blogRouter = express.Router();

// 🧩 Get all blogs
blogRouter.get("/", async (req, res) => {
  try {
    const allBlogs = await db.select().from(blogs);
    res.json(allBlogs);
  } catch (err) {
    console.error("❌ Error fetching blogs:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🧩 Get a single blog by ID
blogRouter.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await db
      .select()
      .from(blogs)
      .where(eq(blogs.id, Number(id)));
    if (!blog.length) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog[0]);
  } catch (err) {
    console.error("❌ Error fetching blog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🧩 Create a new blog
blogRouter.post("/", async (req, res) => {
  try {
    const { title, content, image, author } = req.body;

    if (!title || !content || !author) {
      return res
        .status(400)
        .json({ message: "Title, content, and author are required" });
    }

    await db.insert(blogs).values({
      title,
      content,
      image,
      author, // ✅ Add this line
    });

    res.status(201).json({ message: "Blog created successfully" });
  } catch (err) {
    console.error("❌ Error creating blog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🧩 Update blog
blogRouter.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, image } = req.body;
    const result = await db
      .update(blogs)
      .set({ title, content, image })
      .where(eq(blogs.id, Number(id)));

    if (result[0]?.affectedRows === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog updated successfully" });
  } catch (err) {
    console.error("❌ Error updating blog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

// 🧩 Delete blog
blogRouter.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const result = await db.delete(blogs).where(eq(blogs.id, Number(id)));

    // Some drivers (like mysql2) return an array
    if (result[0]?.affectedRows === 0) {
      return res.status(404).json({ message: "Blog not found" });
    }

    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting blog:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});
export default blogRouter;
