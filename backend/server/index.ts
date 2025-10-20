import express from "express";
import cors from "cors";
import path from "path";
import { raw as db } from "./db.ts";
import { blogRouter } from "./routes/blog.ts";
import { authRouter } from "./routes/auth.ts";

const app = express();

// ✅ MySQL connection test
(async () => {
  try {
    const [rows]: any = await db.execute("SELECT NOW() AS connected");
    console.log("✅ MySQL Connected:", rows[0]);
  } catch (err) {
    console.error("❌ MySQL connection failed:", err);
  }
})();

// ✅ Middleware
app.use(cors({ origin: "http://localhost:5173" })); // allow your frontend
app.use(express.json());

// ✅ Serve uploaded images
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ✅ Routes
app.use("/api/blogs", blogRouter);
app.use("/api/auth", authRouter);

app.get("/", (_, res) => {
  res.send("🚀 Blog API running...");
});

// ✅ Start server
app.listen(8000, () =>
  console.log("🚀 Server running at http://localhost:8000")
);
