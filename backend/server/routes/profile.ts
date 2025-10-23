import express from "express";
import { db } from "../db"; // adjust path if your db connection file is elsewhere
import { users } from "../db/schema";
import { eq } from "drizzle-orm";

const router = express.Router();

// PUT /api/users/:id/profile
router.put("/:id/profile", async (req, res) => {
  const { id } = req.params;
  const { picture } = req.body;

  if (!picture) {
    return res.status(400).json({ error: "Missing picture URL" });
  }

  try {
    await db
      .update(users)
      .set({ picture })
      .where(eq(users.id, Number(id)));
    res.json({ message: "Profile updated successfully", picture });
  } catch (err) {
    console.error("❌ Failed to update profile:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
