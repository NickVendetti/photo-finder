import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  loginUser,
  fetchAllPhotos,
  fetchPhotoDetails,
  fetchPhotographerDetails,
  registerUser,
  uploadPhoto,
} from "./client";
import axios from "axios";

// Mock fetch and axios
window.fetch = vi.fn();
vi.mock("axios");

describe("client API functions", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Setup default successful response for fetch
    window.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ id: "123", message: "success" }),
    });
  });

  it("logs in a user", async () => {
    const credentials = { email: "test@example.com", password: "password123" };

    await loginUser(credentials);

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/login"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(credentials),
      }
    );
  });

  it("fetches all photos", async () => {
    window.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ images: [{ id: "1", image: "photo1.jpg" }] }),
    });

    const photos = await fetchAllPhotos();

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/photos/")
    );
    expect(photos).toHaveLength(1);
    expect(photos[0]).toHaveProperty("imageUrl");
  });

  it("fetches photo details", async () => {
    await fetchPhotoDetails("123");

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/photos/123")
    );
  });

  it("fetches photographer details", async () => {
    await fetchPhotographerDetails("456");

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/photographers/456")
    );
  });

  it("uploads a photo", async () => {
    axios.post.mockResolvedValue({ data: { id: "789", url: "newphoto.jpg" } });

    const result = await uploadPhoto("456", "base64data", "portrait");

    expect(axios.post).toHaveBeenCalledWith(
      expect.stringContaining("/photos/upload"),
      {
        photographer_id: "456",
        image: "base64data",
        photo_type: "portrait",
      }
    );
    expect(result).toEqual({ id: "789", url: "newphoto.jpg" });
  });

  it("registers a user", async () => {
    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123",
    };

    await registerUser(userData);

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/auth/register"),
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      }
    );
  });
});
