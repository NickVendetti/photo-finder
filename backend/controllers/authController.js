import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

/** Register New User */
export const registerUser = async (req, res) => {
  console.log("we made it here", req);
  try {
    const { username, email, password, user_type } = req.body;

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user in DB
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword, // Store hashed password
        user_type,
      },
    });

    res.status(201).json({ message: "User registered successfully", user });
  } catch (error) {
    console.error(" Registration Error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
};

/** Login User */
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, user_type: user.user_type },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ message: "Login successful", token, user });
  } catch (error) {
    console.error(" Login Error:", error);
    res.status(500).json({ error: "Login failed" });
  }
};
