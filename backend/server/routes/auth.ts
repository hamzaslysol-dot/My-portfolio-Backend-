import express from "express";
import jwt from "jsonwebtoken";

export const authRouter = express.Router();
const SECRET = "mysecretkey"; // use env variable in production

// Dummy users for testing
const USERS = [
  {
    username: "admin",
    password: "admin123",
    role: "admin",
    email: "admin@example.com",
  },
  {
    username: "user",
    password: "user123",
    role: "user",
    email: "user@example.com",
  },
];

// POST /api/auth/login
authRouter.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = USERS.find(
    (u) => u.username === username && u.password === password
  );

  if (!user) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  const token = jwt.sign({ username: user.username, role: user.role }, SECRET, {
    expiresIn: "1h",
  });

  res.json({
    token,
    user: { name: user.username, role: user.role, email: user.email },
  });
});
