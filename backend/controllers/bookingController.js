import { UserType } from "@prisma/client";
import prisma from "../prisma/client.js";

/**  Get all bookings */
export const getBookings = async (req, res) => {
  try {
    const { id } = req.params;

    const bookings = await prisma.booking.findMany({
      where: {
        photographer_id: Number(id),
      },
    });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ error: "Error retrieving bookings" });
  }
};

export const createBooking = async (req, res) => {
  try {
    const { bookingType, date, time, photographer_id, user_id } = req.body;

    if (!bookingType || !date || !time || !photographer_id || !user_id) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const photographer = await prisma.user.findUnique({
      where: {
        id: photographer_id,
        user_type: UserType.PHOTOGRAPHER,
      },
    });

    const realDate = new Date(date);
    const [hours, minutes] = time.split(":").map(Number);
    realDate.setHours(hours, minutes, 0, 0);

    const booking = await prisma.booking.create({
      data: {
        bookingType,
        date: new Date(date),
        time,
        photographer_id,
        user_id,
      },
    });

    res.status(201).json(booking);
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ error: "Failed to create booking" });
  }
};

/**  Delete a booking */
export const deleteBooking = async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.booking.delete({ where: { id: parseInt(id) } });

    res.json({ message: "Booking deleted successfully" });
  } catch (error) {
    console.error("Error deleting booking:", error);
    res.status(500).json({ error: "Error deleting booking" });
  }
};
