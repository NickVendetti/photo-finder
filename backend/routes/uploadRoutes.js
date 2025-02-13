import express from "express";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const router = express.Router();

// Set up storage in Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "photo-finder", // Folder where images will be stored
    allowed_formats: ["jpg", "png", "jpeg"],
  },
});

const upload = multer({ storage });

// Route to handle file upload
router.post("/", upload.single("image"), async (req, res) => {
  try {
    res.json({ imageUrl: req.file.path }); // Return uploaded image URL
  } catch (err) {
    console.error("Uploaded Error:", err);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

export default router;
