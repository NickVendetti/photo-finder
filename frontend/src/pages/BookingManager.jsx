import { useEffect, useState } from "react";
import bookingApi from "../api/bookingApi";
import { useAuth } from "../hooks/useAuth";

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
    <div className="bg-gray-100 min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Booking Manager
        </h1>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {bookings &&
              bookings.map((booking) => (
                <li key={booking.id}>
                  <div className="px-4 py-4 sm:px-6">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-indigo-600 truncate">
                        {booking.bookingType}
                      </p>
                      <div className="ml-2 flex-shrink-0 flex">
                        <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {booking.date.toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="mt-2 sm:flex sm:justify-between">
                      <div className="sm:flex">
                        <p className="flex items-center text-sm text-gray-500">
                          Time: {booking.time}
                        </p>
                      </div>
                      <div className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                        <p>User ID: {booking.userId}</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
