import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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

  it("fetches and displays photos after loading", async () => {
    await act(async () => {
      render(<Gallery onPhotoClick={mockPhotoClick} />);
    });

    await waitFor(() => {
      expect(fetchAllPhotos).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    const images = screen.getAllByRole("img");
    expect(images).toHaveLength(mockPhotos.length);

    expect(screen.getByAltText("Photo 1")).toBeInTheDocument();
    expect(screen.getByAltText("Photo 2")).toBeInTheDocument();
  });

  it("handles photo click correctly", async () => {
    await act(async () => {
      render(<Gallery onPhotoClick={mockPhotoClick} />);
    });

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    const firstPhoto = screen.getAllByRole("img")[0];
    fireEvent.click(firstPhoto);

    expect(mockPhotoClick).toHaveBeenCalledWith(mockPhotos[0]);
  });

  it("displays filter dropdown with correct options", async () => {
    await act(async () => {
      render(<Gallery onPhotoClick={mockPhotoClick} />);
    });

    const selectElement = screen.getByRole("combobox");
    expect(selectElement).toBeInTheDocument();

    expect(screen.getByText("All Photos")).toBeInTheDocument();
    expect(screen.getByText("Wedding")).toBeInTheDocument();
    expect(screen.getByText("Portrait")).toBeInTheDocument();
    expect(screen.getByText("Landscape")).toBeInTheDocument();
    expect(screen.getByText("Sports")).toBeInTheDocument();
  });

  it("filters photos correctly when a filter is selected", async () => {
    await act(async () => {
      render(<Gallery onPhotoClick={mockPhotoClick} />);
    });

    await waitFor(() => {
      expect(screen.queryByRole("status")).not.toBeInTheDocument();
    });

    expect(screen.getAllByRole("img")).toHaveLength(4);

    const selectElement = screen.getByRole("combobox");

    await act(async () => {
      fireEvent.change(selectElement, { target: { value: "wedding" } });
    });

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(1);
      expect(screen.getByAltText("Photo 1")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(selectElement, { target: { value: "portrait" } });
    });

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(1);
      expect(screen.getByAltText("Photo 2")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.change(selectElement, { target: { value: "all" } });
    });

    await waitFor(() => {
      expect(screen.getAllByRole("img")).toHaveLength(4);
    });
  });

  it("handles API error gracefully", async () => {
    fetchAllPhotos.mockRejectedValue(new Error("API error"));

    const consoleSpy = vi.spyOn(console, "error").mockImplementation(() => {});

    await act(async () => {
      render(<Gallery onPhotoClick={mockPhotoClick} />);
    });

    await waitFor(() => {
      expect(fetchAllPhotos).toHaveBeenCalledTimes(1);
    });

    expect(consoleSpy).toHaveBeenCalledWith(
      "Error fetching photos:",
      expect.any(Error)
    );

    await waitFor(() => {
      expect(fetchAllPhotos).toHaveBeenCalled();
    });
    expect(screen.queryAllByRole("img")).toHaveLength(0);

    consoleSpy.mockRestore();
  });

  it("handles photos with missing titles correctly", async () => {
    const photosWithMissingTitle = [
      ...mockPhotos,
      { id: 5, imageUrl: "/photo5.jpg", photo_type: "portrait" },
    ];

    fetchAllPhotos.mockResolvedValue(photosWithMissingTitle);

    await act(async () => {
      render(<Gallery onPhotoClick={mockPhotoClick} />);
    });

    await waitFor(() => {
      expect(fetchAllPhotos).toHaveBeenCalled();
    });

    expect(screen.getAllByRole("img")).toHaveLength(5);

    const images = screen.getAllByRole("img");
    expect(images[4]).toHaveAttribute("alt", "Photo");
  });
});
