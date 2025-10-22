import express from "express";
import cors from "cors";
import path from "path";
import dotenv from "dotenv";
import { authRouter } from "./routes/auth";
import blogRouter from "./routes/blog";
import { poolConnection } from "./db";
import uploadRouter from "./routes/upload";
dotenv.config();

const app = express();

// -------------------- Middleware --------------------
app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use("/profiles", express.static(path.join(process.cwd(), "profiles")));

// -------------------- Routes --------------------
app.use("/api/blogs", blogRouter);
app.use("/api/auth", authRouter);
console.log("✅ Routes registered: /api/blogs and /api/auth");

// ✅ Register upload route
app.use("/api/upload", uploadRouter);

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

// -------------------- Test route --------------------
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
