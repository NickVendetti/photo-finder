import express from "express";
import { getAllPhotos, addPhoto } from "../controllers/photoController.js"; // Ensure .js extension is included

const router = express.Router();

// GET all photos
router.get("/", getAllPhotos);

// POST a new photo
router.post("/", addPhoto);

export default router;
