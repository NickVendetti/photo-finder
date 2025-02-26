import { UserType } from "@prisma/client";
import prisma from "../prisma/client.js";

//
// Get all photos with photographer details
//
export const getAllPhotos = async (req, res) => {
  try {
    const photos = await prisma.photo.findMany({
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            user_type: true,
          },
        },
      },
    });

    res.json({ images: photos });
  } catch (error) {
    console.error("Error fetching photos:", error);
    res.status(500).json({ error: error.message || "Error fetching photos" });
  }
};

//
// Get Photo by specific ID
//
export const getByPhotographerId = async (req, res) => {
  try {
    const photographer_id = parseInt(req.params.user_id);
    const photos = await prisma.photo.findMany({
      where: { user_id: photographer_id },
    });
    res.json({ success: true, photos });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch images." });
  }
};

//
// Add a new photo
//
export const addPhoto = async (req, res) => {
  try {
    const { photographer_id, image, photo_type } = req.body;

    if (!photographer_id) {
      return res.status(400).json({ error: "Photographer ID is required" });
    }

    const photographer = await prisma.user.findUnique({
      where: {
        id: parseInt(photographer_id),
        user_type: UserType.PHOTOGRAPHER,
      },
      select: {
        id: true,
        user_type: true,
      },
    });

    if (!photographer) {
      return res.status(404).json({ error: "Photographer not found" });
    }

    const newPhoto = await prisma.photo.create({
      data: {
        user_id: parseInt(photographer_id),
        image,
        photo_type,
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            user_type: true,
          },
        },
      },
    });

    res.json({
      success: true,
      photo: newPhoto,
    });
  } catch (error) {
    console.error("Error adding photo:", error);
    res.status(500).json({
      error: "Failed to create photo",
      details: error.message,
    });
  }
};

export const deleteById = async (req, res) => {
  try {
    const { photo_id } = req.params;

    if (!photo_id) {
      return res.status(400).json({ error: "Photo ID is required" });
    }

    const result = await prisma.photo.delete({
      where: {
        id: Number(photo_id),
      },
    });

    res.json({
      success: true,
      result: result,
    });
  } catch (error) {
    console.error("Error deleting photo:", error);

    // Check if it's a "Record not found" error
    if (error.code === "P2025") {
      return res.status(404).json({ error: "Photo not found" });
    }

    res.status(500).json({
      error: "Failed to delete photo",
      details: error.message,
    });
  }
};
