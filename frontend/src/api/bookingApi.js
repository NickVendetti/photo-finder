import { API_BASE_URL } from "./client";

const FullBookingApiUrl = `${API_BASE_URL}/api/bookings`;
const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }
  return response.json();
};
const bookingApi = {
  createBooking: async (bookingData) => {
    try {
      const response = await fetch(FullBookingApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bookingData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  // Get all bookings for a photographer
  getPhotographerBookings: async (photographerId) => {
    try {
      const response = await fetch(`${FullBookingApiUrl}/${photographerId}`);
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  },

  // Update a booking
  updateBooking: async (bookingId, updateData) => {
    try {
      const response = await fetch(`${FullBookingApiUrl}/${bookingId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error updating booking:", error);
      throw error;
    }
  },

  // Delete a booking
  deleteBooking: async (bookingId) => {
    try {
      const response = await fetch(`${FullBookingApiUrl}/${bookingId}`, {
        method: "DELETE",
      });
      if (response.status === 204) {
        return true;
      }
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting booking:", error);
      throw error;
    }
  },
};

export default bookingApi;
