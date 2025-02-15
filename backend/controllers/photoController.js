import prisma from "../prisma/client.js";

// Get all photos
export const getAllPhotos = async (req, res) => {
  try {
    const photos = await prisma.photo.findMany();
    res.json(photos);
  } catch (error) {
    console.error("Error fetching photos:", error); // Log full error
    res.status(500).json({ error: error.message || "Error fetching photos" });
  }
};

// Add a new photo (Cloudinary Upload)
export const addPhoto = async (req, res) => {
  try {
    const {
      is_public,
      tags,
      latitude,
      longitude,
      title,
      photographer_id,
      image_url,
      source,
    } = req.body;
    const newPhoto = await prisma.photo.create({
      data: {
        photographer_id,
        title,
        image_url,
        is_public,
        tags,
        latitude,
        longitude,
        source,
      },
    });
    res.json(newPhoto);
  } catch (error) {
    res.status(500).json({ error: "Error adding photo" });
  }
};
