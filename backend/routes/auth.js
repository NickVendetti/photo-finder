import express from "express";
import { registerUser, loginUser } from "../controllers/authController.js";

const router = express.Router();

// Define your auth routes here
router.post("/login", (req, res) => {
  res.json({ message: "User logged in" });
});

router.post("/register", (req, res) => {
  res.json({ message: "User registered" });
});

export default router; //  This ensures it can be imported properly
