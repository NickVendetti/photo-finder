import prisma from "../prisma/client.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    console.log("[DEBUG] Fetching all users...");
    const users = await prisma.user.findMany();
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
    const user = await prisma.user.findUnique({
      where: { id: parseInt(req.params.id) },
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

    // Ensure all required fields are provided
    if (!username || !email || !password || !user_type) {
      console.error("Missing required fields:", req.body);
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newUser = await prisma.user.create({
      data: { username, email, password, user_type },
    });

    console.log("User created:", newUser);
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Error creating user" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { username, email, password, user_type } = req.body;

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: { username, email, password, user_type },
    });

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Error updating user" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingUser) {
      return res.status(404).json({ error: "User not found" });
    }

    await prisma.user.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error(" Error deleting user:", error);
    res.status(500).json({ error: "Error deleting user" });
  }
};
