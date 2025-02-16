import prisma from "../prisma/client.js";
import bcrypt from "bcryptjs"; // Add bcrypt for password hashing

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    console.log("[DEBUG] Fetching all users...");
    const users = await prisma.User.findMany(); //  Changed to prisma.User
    console.log("[DEBUG] Users fetched:", users);
    res.json(users);
  } catch (error) {
    console.error("[ERROR] Fetch Users:", error);
    res.status(500).json({ error: "Error fetching users" });
  }
};

// Get single user by ID
export const getUserById = async (req, res) => {
  try {
    console.log(`[DEBUG] Fetching user with ID: ${req.params.id}`);
    const user = await prisma.User.findUnique({
      where: { id: parseInt(req.params.id) }
    });
    if (!user) {
      console.error("[ERROR] User not found:", req.params.id);
      return res.status(400).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("[ERROR] Fetch User:", error);
    res.status(500).json({ error: "Error fetching user" });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { username, email, password, user_type } = req.body;

    console.log("🔍 Received data:", req.body); // Debugging log

    if (!username || !email || !password || !user_type) {
      console.error("Missing required fields:", req.body);
      return res.status(400).json({ error: "Missing required fields" });
    }

    // Hash password before saving to DB
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await prisma.User.create({
      data: { username, email, password: hashedPassword, user_type }
    });

    console.log("User created:", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    let { username, email, password, user_type } = req.body;

    const existingUser = await prisma.User.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    // Hash password if it's being updated
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await prisma.User.update({
      where: { id: parseInt(id) },
      data: { username, email, password, user_type }
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.User.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.User.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};

// Get logged-in user profile
export const getUserProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const user = await prisma.User.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        username: true,
        email: true,
        user_type: true,
        created_at: true
      }
    });

    if (!user) return res.status(404).json({ error: "User not found" });

    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving profile" });
  }
};

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    const { username, email } = req.body;

    const updatedUser = await prisma.User.update({
      where: { id: req.user.id },
      data: { username, email }
    });

    res.json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ error: "Error updating profile" });
  }
};
