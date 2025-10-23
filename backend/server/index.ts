import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth";
import blogRouter from "./routes/blog";
import { poolConnection } from "./db";
import uploadRouter from "./routes/upload";
import profileRoutes from "./routes/profile";

dotenv.config();

const app = express();

// -------------------- Middleware --------------------
app.use(
  cors({
    origin: "http://localhost:5173", // frontend URL
    credentials: true, // important if you use cookies/auth headers
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// -------------------- Static file serving --------------------
// Blog images
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));

// Profile images
app.use("/profiles", express.static(path.join(__dirname, "../profiles")));

// -------------------- Routes --------------------
app.use("/api/blogs", blogRouter);
app.use("/api/auth", authRouter);
app.use("/api/users", profileRoutes);
app.use("/api/projects", uploadRouter);

console.log(
  "✅ Routes registered: /api/blogs, /api/auth, /api/users, /api/upload /api/projects"
);

// -------------------- MySQL connection test (Drizzle ORM) --------------------
(async () => {
  try {
    const connection = await poolConnection.getConnection();
    await connection.ping();
    console.log("✅ MySQL connected successfully!");
    connection.release();
  } catch (err) {
    console.error("❌ MySQL connection failed:", err);
  }
})();

// -------------------- Health check route --------------------
app.get("/", (_: Request, res: Response) => {
  res.send("🚀 Blog API running...");
});

// -------------------- Global error handler --------------------
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("❌ Global error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// -------------------- Start server --------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
