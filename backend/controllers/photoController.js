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
            user_type: true
          }
        }
      }
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
    const userId = parseInt(req.params.photographer_id);
    const photos = await prismaClient.photo.findMany({
      where: { photographer_id }
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
    const { photographer_id, image } = req.body;

    if (!photographer_id) {
      return res.status(400).json({ error: "Photographer ID is required" });
    }

    const photographer = await prisma.user.findUnique({
      where: {
        id: parseInt(photographer_id)
      },
      select: {
        id: true,
        user_type: true
      }
    });

    if (!photographer) {
      return res.status(404).json({ error: "Photographer not found" });
    }

    if (photographer.user_type !== "PHOTOGRAPHER") {
      return res.status(403).json({
        error: "The specified user is not a photographer"
      });
    }

    const newPhoto = await prisma.photo.create({
      data: {
        user_id: parseInt(photographer_id), // Make sure to parse the ID to an integer
        image // Using image_url as per our schema
      },
      include: {
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            user_type: true
          }
        }
      }
    });

    res.json({
      success: true,
      photo: newPhoto
    });
  } catch (error) {
    console.error("Error adding photo:", error);
    res.status(500).json({
      error: "Failed to create photo",
      details: error.message
    });
  }
};

// addPhoto
// async (req, res) => {
//   try {
//     const { userId, image } = req.body;

//     if (!userId || !image) {
//       return res.status(400).json({ error: "User ID and image are required." });
//     }

//     const newPhoto = await prismaClient.photo.create({
//       data: {
//         image,
//         userId: parseInt(userId)
//       }
//     });

//     res.json({ success: true, photo: newPhoto });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ error: "Failed to upload image." });
//   }
// });
