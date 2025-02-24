import express from "express";
import {
  getBookings,
  createBooking,
  deleteBooking,
} from "../controllers/bookingController.js";

const router = express.Router();

// GET all bookings
router.get("/:id", getBookings);

// POST a new booking (creating a new booking)
router.post("/", createBooking);

// DELETE a booking by ID
router.delete("/:id", deleteBooking);

export default router;
