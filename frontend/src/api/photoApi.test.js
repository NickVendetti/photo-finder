import { describe, it, expect, vi, beforeEach } from "vitest";
import photosApi from "./photoApi";

window.fetch = vi.fn();

describe("photosApi", () => {
  beforeEach(() => {
    vi.resetAllMocks();

    // Setup default successful response
    window.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({ photos: [{ id: "123", url: "photo.jpg" }] }),
    });
  });

  it("gets all photos", async () => {
    await photosApi.getAllPhotos();

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/photos")
    );
  });

  it("gets photos by user ID", async () => {
    await photosApi.getPhotosByUserId("456");

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/photos/user/456")
    );
  });

  it("creates an image", async () => {
    const imageData = {
      file: new File(["dummy content"], "test.jpg", { type: "image/jpeg" }),
      title: "Test Image",
      description: "This is a test image",
      tags: ["test", "image"],
    };

    await photosApi.createImage(imageData);

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/photos"),
      expect.objectContaining({
        method: "POST",
        body: expect.any(FormData),
      })
    );
  });

  it("deletes an image", async () => {
    window.fetch.mockResolvedValue({
      status: 204,
    });

    const result = await photosApi.deleteImage("123");

    expect(window.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/photos/123"),
      {
        method: "DELETE",
      }
    );
    expect(result).toBe(true);
  });
});
