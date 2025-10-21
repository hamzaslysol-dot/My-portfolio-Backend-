// middleware/auth.ts
import express from "express";
import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET || "dev-secret";

// TypeScript interface only
export interface AuthRequest extends express.Request {
  user?: { username: string; role: string };
}

export const authenticateJWT = (
  req: AuthRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, SECRET) as {
      username: string;
      role: string;
    };
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

export const authorizeRoles = (...roles: string[]) => {
  return (
    req: AuthRequest,
    res: express.Response,
    next: express.NextFunction
  ) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Forbidden: insufficient permissions" });
    }
    next();
  };
};
