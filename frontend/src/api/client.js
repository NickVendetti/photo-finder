import axios from "axios";

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

/**
 * Login function
 * @param {Object} formData - The user login credentials.
 * @returns {Promise<Object>} - The login response data.
 */
export async function loginUser(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error("Login failed. Please check your credentials.");
    }

    return await response.json();
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
}

/**
 * Fetch all photos
 * @returns {Promise<Array>} - List of photos.
 */
export async function fetchAllPhotos() {
  try {
    const response = await fetch(`${API_BASE_URL}/photos/`);
    if (!response.ok) throw new Error("Failed to fetch photos");

    const data = await response.json();
    return data.images.map((photo) => ({
      ...photo,
      imageUrl: `${photo.image}`,
    }));
  } catch (error) {
    console.error("Error fetching photos:", error);
    return [];
  }
}

/**
 * Fetch photo details by ID
 * @param {string} photoId - The ID of the photo.
 * @returns {Promise<Object>} - Photo details.
 */
export async function fetchPhotoDetails(photoId) {
  try {
    const response = await fetch(`${API_BASE_URL}/photos/${photoId}`);
    if (!response.ok) throw new Error("Failed to fetch photo details");

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching photo details:", error);
    throw error;
  }
}

/**
 * Fetch photographer details by ID
 * @param {string} photographerId - The ID of the photographer.
 * @returns {Promise<Object>} - Photographer details.
 */
export async function fetchPhotographerDetails(photographerId) {
  try {
    const response = await fetch(
      `${API_BASE_URL}/photographers/${photographerId}`
    );
    if (!response.ok) throw new Error("Failed to fetch photographer details");

    return await response.json();
  } catch (error) {
    console.error("Error fetching photographer details:", error);
    throw error;
  }
}

/**
 * Upload an image
 * @param {string} photographerId - The ID of the photographer.
 * @param {string} image - The image file (base64 or file object).
 * @returns {Promise<Object>} - Upload response.
 */
export async function uploadPhoto(photographerId, image, photoType) {
  try {
    const response = await axios.post(`${API_BASE_URL}/photos/upload`, {
      photographer_id: photographerId,
      image,
      photo_type: photoType,
    });

    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

export async function deletePhoto(photoId) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/photos/${photoId}`);

    return response.data;
  } catch (error) {
    console.error("Upload failed:", error);
    throw error;
  }
}

/**
 * Register a new user
 * @param {Object} formData - The user registration data.
 * @returns {Promise<Object>} - The registration response data.
 */
export async function registerUser(formData) {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      if (response.status === 400) {
        throw new Error(
          errorData.message || "Invalid input. Please check your information."
        );
      } else if (response.status === 409) {
        throw new Error("An account with this email already exists.");
      } else {
        throw new Error("Registration failed. Please try again later.");
      }
    }

    return await response.json();
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
}
