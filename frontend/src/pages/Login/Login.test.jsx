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

    expect(screen.getByText("Login to PhotoApp")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Email")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Password")).toBeInTheDocument();
    expect(screen.getByText("Login")).toBeInTheDocument();
    expect(screen.getByText("Don't have an account?")).toBeInTheDocument();
    expect(screen.getByText("Sign Up")).toBeInTheDocument();
  });

  it("updates form state when inputs change", () => {
    render(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");
    fireEvent.change(emailInput, { target: { value: "test@example.com" } });
    expect(emailInput.value).toBe("test@example.com");

    const passwordInput = screen.getByPlaceholderText("Password");
    fireEvent.change(passwordInput, { target: { value: "password123" } });
    expect(passwordInput.value).toBe("password123");
  });

  it("submits the form and navigates to discover page for regular users", async () => {
    loginUser.mockResolvedValue({
      user: { id: "123", user_type: "USER" },
      token: "mock-token",
    });

    render(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByText("Login");

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

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByText("Login");

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
    const mockError = new Error("Login failed");
    loginUser.mockRejectedValue(mockError);

    render(<Login />);

    const emailInput = screen.getByPlaceholderText("Email");
    const passwordInput = screen.getByPlaceholderText("Password");
    const submitButton = screen.getByText("Login");

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

  it("navigates to register page when Sign Up button is clicked", () => {
    render(<Login />);

    const signUpButton = screen.getByText("Sign Up");
    fireEvent.click(signUpButton);

    expect(mockNavigate).toHaveBeenCalledWith("/register");
  });
});
