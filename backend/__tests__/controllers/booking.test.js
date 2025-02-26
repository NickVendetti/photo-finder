import * as bookingController from "../../controllers/bookingController.js";
import { UserType } from "@prisma/client";

// Mock modules
jest.mock("../../prisma/client.js", () => ({
  __esModule: true,
  default: {
    booking: {
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

describe("Booking Controller", () => {
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

  describe("getBookings", () => {
    it("should fetch all bookings for a photographer", async () => {
      // Setup request
      req.params.id = "1";

      // Mock data
      const mockBookings = [
        {
          id: 1,
          bookingType: "PORTRAIT",
          date: new Date(),
          time: "14:00",
          photographer_id: 1,
          user_id: 2,
        },
        {
          id: 2,
          bookingType: "WEDDING",
          date: new Date(),
          time: "10:00",
          photographer_id: 1,
          user_id: 3,
        },
      ];

      // Setup mock
      prisma.booking.findMany.mockResolvedValue(mockBookings);

      // Execute
      await bookingController.getBookings(req, res);

      // Assert
      expect(prisma.booking.findMany).toHaveBeenCalledWith({
        where: {
          photographer_id: 1,
        },
      });

      expect(res.json).toHaveBeenCalledWith(mockBookings);
    });

    it("should handle errors when fetching bookings", async () => {
      // Setup request
      req.params.id = "1";

      // Setup mock to throw error
      prisma.booking.findMany.mockRejectedValue(new Error("Database error"));

      // Execute
      await bookingController.getBookings(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error retrieving bookings",
      });
    });
  });

  describe("createBooking", () => {
    beforeEach(() => {
      // Default request body for booking creation
      req.body = {
        bookingType: "PORTRAIT",
        date: "2023-10-15",
        time: "14:30",
        photographer_id: 1,
        user_id: 2,
      };

      // Mock photographer data
      const mockPhotographer = {
        id: 1,
        username: "photographer1",
        user_type: UserType.PHOTOGRAPHER,
      };

      // Setup mocks
      prisma.user.findUnique.mockResolvedValue(mockPhotographer);
    });

    it("should create a new booking with valid data", async () => {
      // Mock created booking
      const mockCreatedBooking = {
        id: 1,
        bookingType: "PORTRAIT",
        date: new Date("2023-10-15"),
        time: "14:30",
        photographer_id: 1,
        user_id: 2,
      };

      prisma.booking.create.mockResolvedValue(mockCreatedBooking);

      // Execute
      await bookingController.createBooking(req, res);

      // Assert
      expect(prisma.user.findUnique).toHaveBeenCalledWith({
        where: {
          id: 1,
          user_type: UserType.PHOTOGRAPHER,
        },
      });

      expect(prisma.booking.create).toHaveBeenCalledWith({
        data: {
          bookingType: "PORTRAIT",
          date: expect.any(Date),
          time: "14:30",
          photographer_id: 1,
          user_id: 2,
        },
      });

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(mockCreatedBooking);
    });
    it("should return 400 when required fields are missing", async () => {
      // Missing time field
      req.body = {
        bookingType: "PORTRAIT",
        date: "2023-10-15",
        photographer_id: 1,
        user_id: 2,
      };

      // Execute
      await bookingController.createBooking(req, res);

      // Assert
      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith({
        error: "All fields are required",
      });
      expect(prisma.booking.create).not.toHaveBeenCalled();
    });

    it("should handle database errors during booking creation", async () => {
      // Setup mock to throw error
      prisma.booking.create.mockRejectedValue(new Error("Database error"));

      // Execute
      await bookingController.createBooking(req, res);

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Failed to create booking",
      });
    });

    it("should handle date and time formatting correctly", async () => {
      // Mock created booking with expected formatted date
      const mockCreatedBooking = {
        id: 1,
        bookingType: "PORTRAIT",
        date: new Date("2023-10-15"),
        time: "14:30",
        photographer_id: 1,
        user_id: 2,
      };

      prisma.booking.create.mockResolvedValue(mockCreatedBooking);

      // Execute
      await bookingController.createBooking(req, res);

      // Assert date formatting
      const createCall = prisma.booking.create.mock.calls[0][0];
      expect(createCall.data.date).toBeInstanceOf(Date);
      expect(createCall.data.time).toBe("14:30");

      expect(res.status).toHaveBeenCalledWith(201);
    });
  });

  describe("deleteBooking", () => {
    it("should delete a booking with valid ID", async () => {
      // Setup request
      req.params.id = "1";

      // Mock booking deletion
      prisma.booking.delete.mockResolvedValue({ id: 1 });

      // Execute
      await bookingController.deleteBooking(req, res);

      // Assert
      expect(prisma.booking.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });

      expect(res.json).toHaveBeenCalledWith({
        message: "Booking deleted successfully",
      });
    });

    it("should handle errors when deleting a booking", async () => {
      // Setup request
      req.params.id = "999";

      // Setup mock to throw error for non-existent booking
      prisma.booking.delete.mockRejectedValue(new Error("Record not found"));

      // Execute
      await bookingController.deleteBooking(req, res);

      // Assert
      expect(console.error).toHaveBeenCalled();
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        error: "Error deleting booking",
      });
    });
  });
});
