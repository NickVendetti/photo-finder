import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";
import { useAuth } from "../../context/AuthContext";
import { BrowserRouter } from "react-router-dom";

vi.mock("../../context/AuthContext");

describe("Home Component", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    useAuth.mockReturnValue({ isAuthenticated: false });
  });

  const renderWithRouter = (component) => {
    return render(<BrowserRouter>{component}</BrowserRouter>);
  };

  it("renders the welcome message correctly", () => {
    renderWithRouter(<Home />);
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/PhotoBook/i)).toBeInTheDocument();
  });

  it("displays the tagline", () => {
    useAuth.mockReturnValue({ isAuthenticated: false });
    renderWithRouter(<Home />);
    expect(
      screen.getByText(/Connect with photographers and book sessions/i)
    ).toBeInTheDocument();
  });

  it("renders the sign up button when unauthenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: false });

    renderWithRouter(<Home />);
    const signUpButton = screen.getByRole("link", { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute("href", "/register");
  });

  it("renders the discover button when authenticated", () => {
    useAuth.mockReturnValue({ isAuthenticated: true });

    renderWithRouter(<Home />);
    const discoverButton = screen.getByRole("link", {
      name: /discover photographers/i,
    });
    expect(discoverButton).toBeInTheDocument();
    expect(discoverButton).toHaveAttribute("href", "/discover");
  });

});
