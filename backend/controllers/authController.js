import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "../prisma/client.js";
import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, user_type } = req.body;

    const userType =
      user_type === "photographer"
        ? "PHOTOGRAPHER"
        : user_type === "user" ? "USER" : null;

    if (!userType) {
      return res.status(400).json({ message: "Invalid user_type on user" });
    }

    await prisma.$queryRaw`SELECT * FROM "User"`;

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        user_type: userType
      },
      select: { id: true, username: true, email: true, user_type: true }
    });

    return res
      .status(201)
      .json({ message: "User registered successfully", user });
  } catch (error) {
    console.error("Registration Error:", error);

    if (error.code === "P2002") {
      return res
        .status(409)
        .json({ message: "An account with this email already exists." });
    }

    return res
      .status(500)
      .json({ message: "Registration failed. Please try again later." });
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
