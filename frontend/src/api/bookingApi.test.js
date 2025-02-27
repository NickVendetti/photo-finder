import { beforeEach, describe, it, expect, vi } from "vitest";
import bookingApi from "./bookingApi";

// Mock fetch globally
window.fetch = vi.fn();

describe("bookingApi", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Setup default successful response
    window.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "123", status: "confirmed" }),
    });
  });

  it("creates a booking", async () => {
    const bookingData = { date: "2025-03-01", photographerId: "456" };

    const result = await bookingApi.createBooking(bookingData);

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/bookings"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      }
    );
    expect(result).toHaveProperty("id", "123");
  });

  it("gets photographer bookings", async () => {
    await bookingApi.getPhotographerBookings("456");

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/bookings/456")
    );
  });

  it("updates a booking", async () => {
    const updateData = { status: "rescheduled" };

    await bookingApi.updateBooking("123", updateData);

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/bookings/123"),
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      }
    );
  });

  it("deletes a booking", async () => {
    window.fetch.mockResolvedValue({
      status: 204,
    });

    const result = await bookingApi.deleteBooking("123");

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/bookings/123"),
      {
        method: "DELETE",
      }
    );
    expect(result).toBe(true);
  });
});
