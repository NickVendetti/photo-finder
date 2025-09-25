import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Booking from "./Booking";
import bookingApi from "../../api/bookingApi";
import { useAuth } from "../../hooks/useAuth";
import { useNavigate, useParams } from "react-router-dom";

vi.mock("../../api/bookingApi");
vi.mock("../../hooks/useAuth");
vi.mock("react-router-dom");

describe("Booking Component", () => {
  const mockNavigate = vi.fn();
  const mockUser = { id: 123 };

  beforeEach(() => {
    vi.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);
    useParams.mockReturnValue({ photographer_id: "456" });
    useAuth.mockReturnValue({ user: mockUser });
    bookingApi.createBooking.mockResolvedValue({ id: "789" });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correctly with all form elements", () => {
    render(<Booking />);

    expect(screen.getByText("Book Your Session")).toBeInTheDocument();
    expect(screen.getByText("Photographer #456")).toBeInTheDocument();
    expect(screen.getByLabelText("Session Type")).toBeInTheDocument();
    expect(screen.getByLabelText("Select Date")).toBeInTheDocument();
    expect(screen.getByLabelText("Select Time")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm booking/i })
    ).toBeInTheDocument();
  });

  it("displays all booking types in the dropdown", () => {
    render(<Booking />);

    const typeSelect = screen.getByLabelText("Session Type");
    expect(typeSelect).toBeInTheDocument();

    expect(screen.getByText("Portrait Session (1 hour)")).toBeInTheDocument();
    expect(screen.getByText("Family Session (2 hours)")).toBeInTheDocument();
    expect(screen.getByText("Event Coverage (4 hours)")).toBeInTheDocument();
    expect(screen.getByText("Wedding Package (8 hours)")).toBeInTheDocument();
  });

  it("updates form state when inputs change", async () => {
    render(<Booking />);

    const typeSelect = screen.getByLabelText("Session Type");
    fireEvent.change(typeSelect, { target: { value: "portrait" } });
    expect(typeSelect.value).toBe("portrait");

    const dateInput = screen.getByLabelText("Select Date");
    fireEvent.change(dateInput, { target: { value: "2025-03-15" } });
    expect(dateInput.value).toBe("2025-03-15");

    await vi.waitFor(() => {
      const timeInput = screen.getByLabelText("Select Time");
      fireEvent.change(timeInput, { target: { value: "14:30" } });
      expect(timeInput.value).toBe("14:30");
    });
  });

  it("submits the form with correct data and navigates on success", async () => {
    render(<Booking />);

    fireEvent.change(screen.getByLabelText("Session Type"), {
      target: { value: "family" },
    });
    fireEvent.change(screen.getByLabelText("Select Date"), {
      target: { value: "2025-04-20" },
    });

    await vi.waitFor(() => {
      fireEvent.change(screen.getByLabelText("Select Time"), {
        target: { value: "10:00" },
      });
    });

    fireEvent.click(screen.getByRole("button", { name: /confirm booking/i }));

    expect(bookingApi.createBooking).toHaveBeenCalledWith({
      bookingType: "family",
      date: "2025-04-20",
      time: "10:00",
      photographer_id: 456,
      user_id: 123,
    });

    await vi.waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith("/discover");
    });
  });
});
