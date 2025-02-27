import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Home from "./Home";

describe("Home Component", () => {
  it("renders the welcome message correctly", () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to/i)).toBeInTheDocument();
    expect(screen.getByText(/PhotoBook/i)).toBeInTheDocument();
  });

  it("displays the tagline", () => {
    render(<Home />);
    expect(
      screen.getByText(/Connect with photographers and book sessions/i)
    ).toBeInTheDocument();
  });

  it("renders the sign up button with correct link", () => {
    render(<Home />);
    const signUpButton = screen.getByRole("link", { name: /sign up/i });
    expect(signUpButton).toBeInTheDocument();
    expect(signUpButton).toHaveAttribute("href", "/register");
  });

  it("has the correct styling classes for main container", () => {
    const { container } = render(<Home />);
    const mainElement = container.querySelector("main");
    expect(mainElement).toHaveClass("flex");
    expect(mainElement).toHaveClass("flex-col");
    expect(mainElement).toHaveClass("items-center");
  });
});
