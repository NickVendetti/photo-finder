import { API_BASE_URL } from "./client";

const FullBookingApiUrl = `${API_BASE_URL}/bookings`;

const handleResponse = async response => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }
  return response.json();
};
const bookingApi = {
  createBooking: async bookingData => {
    try {
      const response = await fetch(FullBookingApiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  },

  // Get all bookings for a photographer
  getPhotographerBookings: async photographerId => {
    try {
      const response = await fetch(`${FullBookingApiUrl}/${photographerId}`);
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  }
};

export default bookingApi;
