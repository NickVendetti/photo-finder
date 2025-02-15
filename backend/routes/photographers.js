import express from "express";
import {
  getPhotographers,
  createPhotographer,
  getPhotographerById,
  updatePhotographer,
  deletePhotographer,
} from "../controllers/photographerController.js"; // Add .js extension for ES module compatibility

const router = express.Router();

// GET all photographers
router.get("/", getPhotographers);

// GET photographer by ID
router.get("/:id", getPhotographerById);

// POST a new photographer
router.post("/", createPhotographer);

// Update photographer
router.put("/:id", updatePhotographer);

// Delete photographer
router.delete("/:id", deletePhotographer);

export default router;
