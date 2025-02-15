import prisma from "../prisma/client.js";

/** Get all photographers */
export const getPhotographers = async (req, res) => {
  try {
    console.log("📸 Fetching photographers from database...");
    const photographers = await prisma.photographer.findMany();
    console.log("✅ Photographers found:", photographers);
    res.json(photographers);
  } catch (error) {
    console.error("❌ Error fetching photographers:", error);
    res.status(500).json({
      error: "Error retrieving photographers",
      details: error.message,
    });
  }
};

/** Create a photographer profile */
export const createPhotographer = async (req, res) => {
  try {
    const { user_id, bio, portfolio_url, location, profile_picture } = req.body;
    const newPhotographer = await prisma.photographer.create({
      data: { user_id, bio, portfolio_url, location, profile_picture },
    });
    res.status(201).json(newPhotographer);
  } catch (error) {
    res.status(500).json({ error: error });
  }
};

export const getPhotographerById = async (req, res) => {
  try {
    const { id } = req.params;
    const photographer = await prisma.photographer.findUnique({
      where: { id: Number(id) },
    });

    if (!photographer) {
      return res.status(404).json({ error: "Photographer not found" });
    }

    res.json(photographer);
  } catch (error) {
    console.error("Error retrieving photographer:", error);
    res.status(500).json({ error: "Error retrieving photographer" });
  }
};

// Update photographer details
export const updatePhotographer = async (req, res) => {
  try {
    const { id } = req.params; // Get photographer ID from request params
    const { bio, portfolio_url, location, profile_picture } = req.body; // Get update data

    console.log(`[DEBUG] Updating photographer ID: ${id} with data:`, req.body);

    // Ensure photographer exists
    const existingPhotographer = await prisma.photographer.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPhotographer) {
      return res.status(404).json({ error: "Photographer not found" });
    }

    // Update photographer
    const updatedPhotographer = await prisma.photographer.update({
      where: { id: parseInt(id) },
      data: { bio, portfolio_url, location, profile_picture },
    });

    res.json(updatedPhotographer);
  } catch (error) {
    console.error("Error updating photographer:", error);
    res.status(500).json({ error: "Error updating photographer" });
  }
};

// Delete photographer
export const deletePhotographer = async (req, res) => {
  try {
    const { id } = req.params; // Get photographer ID from request params

    console.log(`[DEBUG] Deleting photographer ID: ${id}`);

    // Ensure photographer exists
    const existingPhotographer = await prisma.photographer.findUnique({
      where: { id: parseInt(id) },
    });

    if (!existingPhotographer) {
      return res.status(404).json({ error: "Photographer not found" });
    }

    // Delete photographer
    await prisma.photographer.delete({
      where: { id: parseInt(id) },
    });

    res.json({ message: "Photographer deleted successfully" });
  } catch (error) {
    console.error("Error deleting photographer:", error);
    res.status(500).json({ error: "Error deleting photographer" });
  }
};
