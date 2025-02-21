import express from "express";
import {
  getAllPhotos,
  addPhoto,
  getByPhotographerId
} from "../controllers/photoController.js";

const router = express.Router();

router.get("/", getAllPhotos);
router.post("/upload", addPhoto);
router.get("/:photographer_id", getByPhotographerId);
router.get("/user/:user_id", getByPhotographerId);

export default router;
