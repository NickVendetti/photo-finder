import axios from "axios";

// Load API keys from environment variables
const API_KEY = import.meta.env.VITE_FLICKR_API_KEY;
const API_SECRET = import.meta.env.VITE_FLICKR_API_SECRET;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

/** Fetch photos from Flickr */
async function fetchPhotos(searchTerm) {
  try {
    const response = await axios.get(BASE_URL, {
      params: {
        method: "flickr.photos.search",
        api_key: API_KEY,
        text: searchTerm,
        format: "json",
        nojsoncallback: 1,
        per_page: 10,
      }
    });
    // Log response for debugging
    console.log("Fetched Photos:", response.data.photos.photo);
    return response.data.photos.photo;
  } catch (err){
    console.error("Error fetching photos:", err);
    return [];
  }
}

export default fetchPhotos;