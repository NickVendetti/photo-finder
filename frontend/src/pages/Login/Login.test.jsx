import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Login from "./Login";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../../api/client";

vi.mock("../../context/AuthContext");
vi.mock("react-router-dom");
vi.mock("../../api/client");

describe("Login Component", () => {
  const mockNavigate = vi.fn();
  const mockLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    useNavigate.mockReturnValue(mockNavigate);
    useAuth.mockReturnValue({ login: mockLogin });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correctly with all form elements", () => {
    render(<Login />);

    expect(screen.getByText("Login to PhotoBook")).toBeInTheDocument();
    expect(screen.getByLabelText("Email address")).toBeInTheDocument();
    expect(screen.getByLabelText("Password")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("updates form state when inputs change", () => {
    render(<Login />);

    const emailInput = screen.getByLabelText("Email address");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");

    const passwordInput = screen.getByLabelText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");
  });

  it("submits the form and navigates to discover page for regular users", async () => {
    loginUser.mockResolvedValue({
      user: { id: "123", user_type: "USER" },
      token: "mock-token",
    });

    render(<Login />);

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "user@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "userpassword" } });
    fireEvent.click(submitButton);

    expect(loginUser).toHaveBeenCalledWith({
      email: "user@example.com",
      password: "userpassword",
    });

    await vi.waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { id: "123", user_type: "USER" },
        "mock-token"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/discover");
    });
  });

  it("submits the form and navigates to profile-dashboard for photographers", async () => {
    loginUser.mockResolvedValue({
      user: { id: "456", user_type: "PHOTOGRAPHER" },
      token: "mock-token",
    });

    render(<Login />);

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, {
      target: { value: "photographer@example.com" },
    });
    fireEvent.change(passwordInput, { target: { value: "photopass" } });
    fireEvent.click(submitButton);

    expect(loginUser).toHaveBeenCalledWith({
      email: "photographer@example.com",
      password: "photopass",
    });

    await vi.waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith(
        { id: "456", user_type: "PHOTOGRAPHER" },
        "mock-token"
      );
      expect(mockNavigate).toHaveBeenCalledWith("/profile-dashboard");
    });
  });

  it("displays error message when login fails", async () => {
    loginUser.mockRejectedValue(new Error("Login failed"));

    render(<Login />);

    const emailInput = screen.getByLabelText("Email address");
    const passwordInput = screen.getByLabelText("Password");
    const submitButton = screen.getByRole("button", { name: /login/i });

    fireEvent.change(emailInput, { target: { value: "invalid@example.com" } });
    fireEvent.change(passwordInput, { target: { value: "wrongpassword" } });
    fireEvent.click(submitButton);

    await vi.waitFor(() => {
      expect(
        screen.getByText("Invalid email or password. Please try again.")
      ).toBeInTheDocument();
    });
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
