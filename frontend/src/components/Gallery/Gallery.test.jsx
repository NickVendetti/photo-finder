import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Gallery from "./Gallery";
import { fetchAllPhotos } from "../../api/client";

vi.mock("../../api/client");

describe("Gallery Component", () => {
  const mockPhotos = [
    { id: 1, imageUrl: "/photo1.jpg", title: "Photo 1", photo_type: "wedding" },
    {
      id: 2,
      imageUrl: "/photo2.jpg",
      title: "Photo 2",
      photo_type: "portrait",
    },
    {
      id: 3,
      imageUrl: "/photo3.jpg",
      title: "Photo 3",
      photo_type: "landscape",
    },
    { id: 4, imageUrl: "/photo4.jpg", title: "Photo 4", photo_type: "sports" },
  ];

  const mockPhotoClick = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    fetchAllPhotos.mockResolvedValue(mockPhotos);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders correctly with loading state initially", () => {
    render(<Gallery onPhotoClick={mockPhotoClick} />);

    expect(screen.getByText("Loading...")).toBeInTheDocument();
  });

  it("fetches and displays photos after loading", async () => {
    render(<Gallery onPhotoClick={mockPhotoClick} />);

    await waitFor(() => {
      expect(fetchAllPhotos).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(mockPhotos.length);

    expect(screen.getByAltText("Photo 1")).toBeInTheDocument();
    expect(screen.getByAltText("Photo 2")).toBeInTheDocument();
  });

  it("handles photo click correctly", async () => {
    render(<Gallery onPhotoClick={mockPhotoClick} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    const firstPhoto = screen.getAllByRole("img")[0];
    fireEvent.click(firstPhoto);

    expect(mockPhotoClick).toHaveBeenCalledWith(mockPhotos[0]);
  });

  it("displays filter dropdown with correct options", async () => {
    render(<Gallery onPhotoClick={mockPhotoClick} />);

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();

    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Wedding")).toBeInTheDocument();
    expect(screen.getByText("Portrait")).toBeInTheDocument();
    expect(screen.getByText("Landscape")).toBeInTheDocument();
    expect(screen.getByText("Sports")).toBeInTheDocument();
  });

  it("filters photos correctly when a filter is selected", async () => {
    render(<Gallery onPhotoClick={mockPhotoClick} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    expect(screen.getAllByRole("img")).toHaveLength(4);

    // Select wedding filter
    const selectElement = screen.getByRole("combobox");
    fireEvent.change(selectElement, { target: { value: "wedding" } });

    // Now only wedding photos should be shown (1 in our mock data)
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByAltText("Photo 1")).toBeInTheDocument();

    // Change to portrait filter
    fireEvent.change(selectElement, { target: { value: "portrait" } });

    // Now only portrait photos should be shown (1 in our mock data)
    expect(screen.getAllByRole("img")).toHaveLength(1);
    expect(screen.getByAltText("Photo 2")).toBeInTheDocument();

    // Change back to all
    fireEvent.change(selectElement, { target: { value: "all" } });

    // All photos should be shown again
    expect(screen.getAllByRole("img")).toHaveLength(4);
  });

  it("handles API error gracefully", async () => {
    // Mock API failure
    fetchAllPhotos.mockRejectedValue(new Error("API error"));

    // Spy on console.error
    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    render(<Gallery onPhotoClick={mockPhotoClick} />);

    await waitFor(() => {
      expect(fetchAllPhotos).toHaveBeenCalledTimes(1);
    });

    // Check error was logged
    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching photos:",
      expect.any(Error)
    );

    // Loading state should be gone, but no photos displayed
    expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    expect(screen.queryAllByRole("img")).toHaveLength(0);

    consoleSpy.mockRestore();
  });

  it("handles photos with missing titles correctly", async () => {
    // Add a photo with no title
    const photosWithMissingTitle = [
      ...mockPhotos,
      { id: 5, imageUrl: "/photo5.jpg", photo_type: "portrait" }, // No title
    ];

    fetchAllPhotos.mockResolvedValue(photosWithMissingTitle);

    render(<Gallery onPhotoClick={mockPhotoClick} />);

    await waitFor(() => {
      expect(screen.queryByText("Loading...")).not.toBeInTheDocument();
    });

    // There should be 5 images now
    expect(screen.getAllByRole("img")).toHaveLength(5);

    // The last one should have the default alt text
    const images = screen.getAllByRole("img");
    expect(images[4]).toHaveAttribute("alt", "Photo");
  });
});
