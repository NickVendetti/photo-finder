import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Correct routes calling actual controller functions
router.post("/login", loginUser);
router.post("/register", registerUser);

export default router;
