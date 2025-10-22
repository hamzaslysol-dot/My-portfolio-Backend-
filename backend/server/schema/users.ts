import express from "express";

const router = express.Router();

// Mock database for example purposes
// Replace with your real DB logic (e.g. Prisma, Sequelize, Mongoose, etc.)
const users: Record<string, any> = {
  "1": { id: "1", name: "Admin", picture: "", role: "admin" },
};

// ✅ PUT /api/users/:id/profile
router.put("/:id/profile", (req, res) => {
  const { id } = req.params;
  const { picture } = req.body;

  if (!users[id]) {
    return res.status(404).json({ error: "User not found" });
  }

  users[id].picture = picture;
  res.json({ success: true, user: users[id] });
});

export default router;
