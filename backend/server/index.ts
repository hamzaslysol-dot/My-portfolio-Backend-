import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { db } from "./db.ts";
import { authRouter } from "./routes/auth.ts";
import blogRouter from "./routes/blog.ts";

dotenv.config();

const app = express();

// -------------------- MySQL connection test --------------------
(async () => {
  try {
    const [rows]: any = await db.execute("SELECT NOW() AS connected");
    console.log("✅ MySQL Connected:", rows[0]);
  } catch (err) {
    console.error("❌ MySQL connection failed:", err);
  }
})();

// -------------------- Middleware --------------------
app.use(cors({ origin: "http://localhost:5173" })); // allow your frontend
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// -------------------- Routes --------------------
app.use("/api/blogs", blogRouter);
app.use("/api/auth", authRouter);
console.log("✅ Routes registered: /api/blogs and /api/auth");

// Test route
app.get("/", (_, res) => {
  res.send("🚀 Blog API running...");
});

// -------------------- Global error handler --------------------
app.use((err: any, req: any, res: any, next: any) => {
  console.error("❌ Global error:", err);
  res.status(500).json({ message: "Internal server error" });
});

// -------------------- Start server --------------------
const PORT = process.env.PORT || 8000;
app.listen(PORT, () =>
  console.log(`🚀 Server running at http://localhost:${PORT}`)
);
