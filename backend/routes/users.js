import express from "express";
import {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  getUserProfile,
  updateUserProfile,
} from "../controllers/userController.js";
// import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// protect with the auth middleware!
// router.get("/profile", protect, getUserProfile);
// router.put("/profile", protect, updateUserProfile);

// Public routes
router.get("/", getAllUsers);
router.post("/", createUser);
router.get("/:id", getUserById);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
