import prisma from "../prisma/client.js";

/**  Get all bookings */
export const getBookings = async (req, res) => {
  try {
    console.log("Received event_date:", req.body.event_date);
    const bookings = await prisma.booking.findMany();
    console.log("📌 Retrieved Bookings:", bookings); // Debugging log
    res.json(bookings);
  } catch (error) {
    console.error("❌ Error retrieving bookings:", error); // Debugging log
    res.status(500).json({ error: "Error retrieving bookings" });
  }
};

/**  Create a new booking */
export const createBooking = async (req, res) => {
  try {
    console.log("[DEBUG] Incoming booking request:", req.body);

    const { photographer_id, customer_id, event_date, status } = req.body;

    if (!photographer_id || !customer_id || !event_date) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const newBooking = await prisma.booking.create({
      data: {
        photographer_id,
        customer_id,
        event_date: new Date(event_date), // Ensure this is a valid Date object
        status: status || "pending",
      },
    });

    res.status(201).json(newBooking);
  } catch (error) {
    console.error("❌ Error creating booking:", error);
    res.status(500).json({ error: "Error creating booking" });
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
