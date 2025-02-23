import { API_BASE_URL } from "./client";

const FullPhotosApiUrl = `${API_BASE_URL}/photos`;

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "API request failed");
  }
  return response.json();
};

const photosApi = {
  // Get all photos
  getAllPhotos: async () => {
    try {
      const response = await fetch(FullPhotosApiUrl);
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching photos:", error);
      throw error;
    }
  },

  // Get all photos by user ID
  getPhotosByUserId: async (userId) => {
    try {
      const response = await fetch(`${FullPhotosApiUrl}/user/${userId}`);
      return handleResponse(response);
    } catch (error) {
      console.error("Error fetching user photos:", error);
      throw error;
    }
  },

  // Create a new image
  createImage: async (imageData) => {
    try {
      const formData = new FormData();
      
      // If imageData contains a file object, append it to formData
      if (imageData.file) {
        formData.append('file', imageData.file);
      }
      
      // Add other image metadata to formData
      if (imageData.title) formData.append('title', imageData.title);
      if (imageData.description) formData.append('description', imageData.description);
      if (imageData.tags && Array.isArray(imageData.tags)) {
        imageData.tags.forEach(tag => formData.append('tags[]', tag));
      }

      const response = await fetch(FullPhotosApiUrl, {
        method: "POST",
        body: formData,
        // Note: Don't set Content-Type header when using FormData
        // It will be set automatically including the boundary
      });
      
      return handleResponse(response);
    } catch (error) {
      console.error("Error creating image:", error);
      throw error;
    }
  },

  // Delete an image by ID
  deleteImage: async (imageId) => {
    try {
      const response = await fetch(`${FullPhotosApiUrl}/${imageId}`, {
        method: "DELETE",
      });
      if (response.status === 204) {
        return true;
      }
      return handleResponse(response);
    } catch (error) {
      console.error("Error deleting image:", error);
      throw error;
    }
  },
};

export default photosApi;