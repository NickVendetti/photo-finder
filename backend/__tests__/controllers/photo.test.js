import * as photoController from "../../controllers/photoController.js";
import { UserType } from "@prisma/client";

// Mock modules
jest.mock("../../prisma/client.js", () => ({
  __esModule: true,
  default: {
    photo: {
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    user: {
      findUnique: jest.fn(),
    },
  },
}));

// Import the mocked prisma client
import prisma from "../../prisma/client.js";

describe("Photo Controller", () => {
  let req, res;

  beforeEach(() => {
    // Reset mocks between tests
    jest.clearAllMocks();

    // Setup req and res objects
    req = {
      params: {},
      body: {},
    };

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    // Spy on console methods
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    // Restore console methods
    console.error.mockRestore();
  });

  describe("getAllPhotos", () => {
    it("should fetch all photos with photographer details", async () => {
      // Mock data
      const mockPhotos = [
        {
          id: 1,
          image: "image1.jpg",
          photo_type: "PORTRAIT",
          user_id: 1,
          user: {
            id: 1,
            username: "photographer1",
            email: "photo1@example.com",
            user_type: UserType.PHOTOGRAPHER,
          },
        },
        {
          id: 2,
          image: "image2.jpg",
          photo_type: "LANDSCAPE",
          user_id: 2,
          user: {
            id: 2,
            username: "photographer2",
            email: "photo2@example.com",
            user_type: UserType.PHOTOGRAPHER,
          },
        },
      ];

      // Setup mock
      prisma.photo.findMany.mockResolvedValue(mockPhotos);

      // Execute
      await photoController.getAllPhotos(req, res);

      // Assert
      expect(prisma.photo.findMany).toHaveBeenCalledWith({
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

      expect(res.json).toHaveBeenCalledWith({ images: mockPhotos });
    });

    it("should handle errors when fetching photos", async () => {
      // Setup mock to throw error
      const errorMessage = "Database connection error";
      prisma.photo.findMany.mockRejectedValue(new Error(errorMessage));

      // Execute
      await photoController.getAllPhotos(req, res);

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: errorMessage });
    });
  });

  describe("getByPhotographerId", () => {
    it("should fetch photos for a specific photographer", async () => {
      // Setup request
      req.params.user_id = "1";

      // Mock data
      const mockPhotos = [
        {
          id: 1,
          image: "image1.jpg",
          photo_type: "PORTRAIT",
          user_id: 1,
        },
        {
          id: 3,
          image: "image3.jpg",
          photo_type: "WEDDING",
          user_id: 1,
        },
      ];

      // Setup mock
      prisma.photo.findMany.mockResolvedValue(mockPhotos);

      // Execute
      await photoController.getByPhotographerId(req, res);

      // Assert
      expect(prisma.photo.findMany).toHaveBeenCalledWith({
        where: { user_id: 1 },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        photos: mockPhotos,
      });
    });

    it("should handle errors when fetching photos by photographer ID", async () => {
      // Setup request
      req.params.user_id = "999";

      // Setup mock to throw error
      prisma.photo.findMany.mockRejectedValue(new Error("Database error"));

      // Execute
      await photoController.getByPhotographerId(req, res);

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to fetch images.",
      });
    });
  });

  describe("addPhoto", () => {
    beforeEach(() => {
      // Default request body for photo creation
      req.body = {
        photographer_id: "1",
        image: "base64encodedimage...",
        photo_type: "PORTRAIT",
      };

      // Mock photographer data
      const mockPhotographer = {
        id: 1,
        user_type: UserType.PHOTOGRAPHER,
      };

      // Setup mocks
      prisma.user.findUnique.mockResolvedValue(mockPhotographer);
    });

    it("should add a new photo with valid data", async () => {
      // Mock created photo
      const mockCreatedPhoto = {
        id: 1,
        image: "base64encodedimage...",
        photo_type: "PORTRAIT",
        user_id: 1,
        user: {
          id: 1,
          username: "photographer1",
          email: "photo1@example.com",
          user_type: UserType.PHOTOGRAPHER,
        },
      };

      prisma.photo.create.mockResolvedValue(mockCreatedPhoto);

      // Execute
      await photoController.addPhoto(req, res);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
          user_type: UserType.PHOTOGRAPHER,
        },
        select: {
          id: true,
          user_type: true,
        },
      });

      expect(prisma.photo.create).toHaveBeenCalledWith({
        data: {
          user_id: 1,
          image: "base64encodedimage...",
          photo_type: "PORTRAIT",
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

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        photo: mockCreatedPhoto,
      });
    });

    it("should return 400 when photographer_id is missing", async () => {
      // Missing photographer_id
      req.body = {
        image: "base64encodedimage...",
        photo_type: "PORTRAIT",
      };

      // Execute
      await photoController.addPhoto(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Photographer ID is required",
      });
      expect(prisma.photo.create).not.toHaveBeenCalled();
    });

    it("should return 404 when photographer is not found", async () => {
      // Setup mock to return null (photographer not found)
      prisma.user.findUnique.mockResolvedValue(null);

      // Execute
      await photoController.addPhoto(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "Photographer not found",
      });
      expect(prisma.photo.create).not.toHaveBeenCalled();
    });

    it("should handle database errors during photo creation", async () => {
      // Setup mock to throw error
      const errorMessage = "Image too large";
      const error = new Error(errorMessage);
      prisma.photo.create.mockRejectedValue(error);

      // Execute
      await photoController.addPhoto(req, res);

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to create photo",
        details: errorMessage,
      });
    });
  });

  describe("deleteById", () => {
    it("should delete a photo with valid ID", async () => {
      // Setup request
      req.params.photo_id = "1";

      // Mock deletion result
      const mockDeletedPhoto = {
        id: 1,
        image: "image1.jpg",
        photo_type: "PORTRAIT",
        user_id: 1,
      };

      prisma.photo.delete.mockResolvedValue(mockDeletedPhoto);

      // Execute
      await photoController.deleteById(req, res);

      // Assert
      expect(prisma.photo.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(res.json).toHaveBeenCalledWith({
        success: true,
        result: mockDeletedPhoto,
      });
    });

    it("should return 400 when photo_id is missing", async () => {
      // Missing photo_id
      req.params = {};

      // Execute
      await photoController.deleteById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "Photo ID is required" });
      expect(prisma.photo.delete).not.toHaveBeenCalled();
    });

    it("should return 404 when photo is not found", async () => {
      // Setup request
      req.params.photo_id = "999";

      // Mock Prisma's "Record not found" error
      const notFoundError = new Error("Record not found");
      notFoundError.code = "P2025";
      prisma.photo.delete.mockRejectedValue(notFoundError);

      // Execute
      await photoController.deleteById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ error: "Photo not found" });
    });

    it("should handle database errors when deleting a photo", async () => {
      // Setup request
      req.params.photo_id = "1";

      // Mock database error
      const dbError = new Error("Database connection error");
      prisma.photo.delete.mockRejectedValue(dbError);

      // Execute
      await photoController.deleteById(req, res);

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to delete photo",
        details: "Database connection error",
      });
    });
  });
});
