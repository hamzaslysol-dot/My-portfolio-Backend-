import express, { Request, Response } from "express";
import multer from "multer";
import path from "path";

const uploadRouter = express.Router();

// ✅ Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(process.cwd(), "profiles"));
  },
  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      Math.round(Math.random() * 1e9) +
      path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const upload = multer({ storage });

// ✅ Upload route
uploadRouter.post(
  "/",
  upload.single("image"),
  (req: Request, res: Response) => {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const fileUrl = `http://localhost:8000/profiles/${req.file.filename}`;
    return res.status(200).json({ url: fileUrl });
  }
);

export default uploadRouter;
