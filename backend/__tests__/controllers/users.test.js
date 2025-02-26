import * as userController from "../../controllers/userController.js";
import bcrypt from "bcryptjs";

jest.mock("../../prisma/client.js", () => ({
  __esModule: true,
  default: {
    User: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  genSalt: jest.fn().mockResolvedValue("mockedsalt"),
  hash: jest.fn().mockResolvedValue("hashedpassword123"),
}));

import prisma from "../../prisma/client.js";

describe("User Controller", () => {
  let req, res;

  beforeEach(() => {
    jest.clearAllMocks();

    req = {
      params: {},
      body: {},
      user: { id: 1 },
    };

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();
  });

  afterEach(() => {
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe("getAllUsers", () => {
    it("should return all users", async () => {
      // Arrange
      const mockUsers = [
        { id: 1, username: "user1", email: "user1@example.com" },
        { id: 2, username: "user2", email: "user2@example.com" },
      ];

      prisma.User.findMany.mockResolvedValue(mockUsers);

      // Act
      await userController.getAllUsers(req, res);

      // Assert
      expect(prisma.User.findMany).toHaveBeenCalledTimes(1);
      expect(res.json).toHaveBeenCalledWith(mockUsers);
    });

    it("should handle errors", async () => {
      // Setup mock to throw error
      const errorMsg = "Database connection failed";
      prisma.User.findMany.mockRejectedValue(new Error(errorMsg));

      // Execute
      await userController.getAllUsers(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error fetching users" });
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("getUserById", () => {
    it("should return a user when valid ID is provided", async () => {
      // Mock data
      const mockUser = { id: 1, username: "user1", email: "user1@example.com" };
      req.params.id = "1";

      // Setup mock
      prisma.User.findUnique.mockResolvedValue(mockUser);

      // Execute
      await userController.getUserById(req, res);

      // Assert
      expect(prisma.User.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
      });
      expect(res.json).toHaveBeenCalledWith(mockUser);
    });

    it("should return 400 when user is not found", async () => {
      // Arrange
      req.params.id = "999";
      prisma.User.findUnique.mockResolvedValue(null);

      // Act
      await userController.getUserById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: "User not found" });
    });

    it("should handle errors", async () => {
      // Arrange
      req.params.id = "1";
      prisma.User.findUnique.mockRejectedValue(new Error("Database error"));

      // Act
      await userController.getUserById(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error fetching user" });
    });
  });

  describe("createUser", () => {
    it("should create a new user with valid data", async () => {
      // Setup request data
      req.body = {
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        user_type: "client",
      };

      // Mock response data
      const mockCreatedUser = {
        id: 3,
        username: "newuser",
        email: "newuser@example.com",
        user_type: "client",
      };

      // Setup mock
      prisma.User.create.mockResolvedValue(mockCreatedUser);

      // Execute
      await userController.createUser(req, res);

      // Assert
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", "mockedsalt");

      expect(prisma.User.create).toHaveBeenCalledWith({
        data: {
          username: "newuser",
          email: "newuser@example.com",
          password: "hashedpassword123",
          user_type: "client",
        },
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedUser);
    });

    it("should return 400 when required fields are missing", async () => {
      // Missing email field
      req.body = {
        username: "newuser",
        password: "password123",
        user_type: "client",
      };

      // Execute
      await userController.createUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "Missing required fields",
      });
      expect(prisma.User.create).not.toHaveBeenCalled();
    });

    it("should handle database errors", async () => {
      // Setup complete request data
      req.body = {
        username: "newuser",
        email: "newuser@example.com",
        password: "password123",
        user_type: "client",
      };

      // Setup mock to throw error
      prisma.User.create.mockRejectedValue(
        new Error("Unique constraint failed on email")
      );

      // Execute
      await userController.createUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: "Error creating user" });
    });
  });
});
