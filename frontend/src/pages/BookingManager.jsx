import { useEffect, useState } from "react";
import bookingApi from "../api/bookingApi";
import { useAuth } from "../context/AuthContext";

export default function BookingManager() {
  const { photographerId } = useAuth();
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    const getBookings = async () => {
      try {
        const response = await bookingApi.getPhotographerBookings(
          photographerId
        );
        const bookingsForCurrentPhotographer = response.map((booking) => ({
          id: booking.id,
          bookingType: booking.bookingType,
          date: new Date(booking.date),
          time: booking.time,
          userId: booking.user_id,
        }));
        setBookings(bookingsForCurrentPhotographer);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      }
    };

    getBookings();
  }, [photographerId]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Booking Manager</h1>
      <div className="space-y-4">
        {bookings &&
          bookings.map((booking) => (
            <div key={booking.id} className="border p-4 rounded-lg shadow">
              <h2 className="text-xl font-semibold">{booking.bookingType}</h2>
              <p>Date: {booking.date.toLocaleDateString()}</p>
              <p>Time: {booking.time}</p>
              <p>User ID: {booking.userId}</p>
            </div>
          ))}
      </div>
    </div>
  );
}
