import * as authController from "../../controllers/authController.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserType } from "@prisma/client";

jest.mock("../../prisma/client.js", () => ({
  __esModule: true,
  default: {
    user: {
      create: jest.fn(),
      findUnique: jest.fn(),
    },
  },
}));

jest.mock("bcryptjs", () => ({
  genSalt: jest.fn().mockResolvedValue("mockedsalt"),
  hash: jest.fn().mockResolvedValue("hashedpassword123"),
  compare: jest.fn(),
}));

jest.mock("jsonwebtoken", () => ({
  sign: jest.fn().mockReturnValue("mocked-jwt-token"),
}));

// Mock dotenv
jest.mock("dotenv", () => ({
  config: jest.fn(),
}));

// Import the mocked prisma client
import prisma from "../../prisma/client.js";

describe("Auth Controller", () => {
  let req, res;

  beforeEach(() => {
    // Reset all mocks
    jest.clearAllMocks();

    // Setup req and res objects
    req = {
      body: {},
    };

    res = {
      json: jest.fn().mockReturnThis(),
      status: jest.fn().mockReturnThis(),
    };

    // Spy on console methods
    jest.spyOn(console, "log").mockImplementation();
    jest.spyOn(console, "error").mockImplementation();

    // Set environment variable
    process.env.JWT_SECRET = "test-secret-key";
  });

  afterEach(() => {
    // Restore console methods
    console.log.mockRestore();
    console.error.mockRestore();
  });

  describe("registerUser", () => {
    beforeEach(() => {
      // Default request body for registration
      req.body = {
        username: "testuser",
        email: "test@example.com",
        password: "password123",
        user_type: "user",
      };
    });

    it("should register a new user successfully", async () => {
      // Mock user creation response
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        user_type: UserType.USER,
      };

      prisma.user.create.mockResolvedValue(mockUser);

      // Execute
      await authController.registerUser(req, res);

      // Assert
      expect(bcrypt.genSalt).toHaveBeenCalledWith(10);
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", "mockedsalt");

      expect(prisma.user.create).toHaveBeenCalledWith({
        data: {
          username: "testuser",
          email: "test@example.com",
          password: "hashedpassword123",
          user_type: UserType.USER,
        },
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: mockUser,
      });
    });

    it("should register a photographer user type correctly", async () => {
      // Change user_type to photographer
      req.body.user_type = "photographer";

      // Mock user creation response
      const mockUser = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        user_type: UserType.PHOTOGRAPHER,
      };

      prisma.user.create.mockResolvedValue(mockUser);

      // Execute
      await authController.registerUser(req, res);

      // Assert
      expect(prisma.user.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          user_type: UserType.PHOTOGRAPHER,
        }),
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith({
        message: "User registered successfully",
        user: mockUser,
      });
    });

    it("should return 401 with invalid user_type", async () => {
      // Set invalid user_type
      req.body.user_type = "invalid_type";

      // Execute
      await authController.registerUser(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        error: "Invalid user_type on user",
      });
      expect(prisma.user.create).not.toHaveBeenCalled();
    });

    it('should handle database errors during registration', async () => {
        // Setup mock to throw error
        prisma.user.create.mockRejectedValue(new Error('Database error'));
        
        // Execute
        await authController.registerUser(req, res);
        
        // Assert
        expect(console.error).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Registration failed' });
      });
  });

  describe('loginUser', () => {
    beforeEach(() => {
      // Default request body for login
      req.body = {
        email: 'test@example.com',
        password: 'password123'
      };
      
      // Default user found in database
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        password: 'hashedpassword123',
        user_type: UserType.USER
      };
      
      prisma.user.findUnique.mockResolvedValue(mockUser);
    });
    
    it('should login a user successfully with valid credentials', async () => {
      // Mock successful password comparison
      bcrypt.compare.mockResolvedValue(true);
      
      // Execute
      await authController.loginUser(req, res);
      
      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: { email: 'test@example.com' }
      });
      
      expect(bcrypt.compare).toHaveBeenCalledWith('password123', 'hashedpassword123');
      
      expect(jwt.sign).toHaveBeenCalledWith(
        { id: 1, user_type: UserType.USER },
        'supersecretkey',
        { expiresIn: '1h' }
      );
      
      expect(res.json).toHaveBeenCalledWith({
        message: 'Login successful',
        token: 'mocked-jwt-token',
        user: expect.objectContaining({ id: 1, email: 'test@example.com' })
      });
    });
    
    it('should return 400 if user email not found', async () => {
      // Mock user not found
      prisma.user.findUnique.mockResolvedValue(null);
      
      // Execute
      await authController.loginUser(req, res);
      
      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });
    
    it('should return 400 if password is incorrect', async () => {
      // Mock failed password comparison
      bcrypt.compare.mockResolvedValue(false);
      
      // Execute
      await authController.loginUser(req, res);
      
      // Assert
      expect(bcrypt.compare).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({ error: 'Invalid credentials' });
      expect(jwt.sign).not.toHaveBeenCalled();
    });
    
    it('should handle database errors during login', async () => {
      // Setup mock to throw error
      prisma.user.findUnique.mockRejectedValue(new Error('Database error'));
      
      // Execute
      await authController.loginUser(req, res);
      
      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Login failed' });
    });
    
    it('should handle bcrypt comparison errors', async () => {
      // Setup mock to throw error
      bcrypt.compare.mockRejectedValue(new Error('Bcrypt error'));
      
      // Execute
      await authController.loginUser(req, res);
      
      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Login failed' });
    });
  });
});
