import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import DiscoveryPage from "./pages/DiscoveryPage";
import PhotoDetailsPage from "./pages/PhotoDetailsPage";
import LandingPage from "./pages/LandingPage";
import fetchPhotos from "./api/flickrApi"; // Ensure correct import for fetching photos
import Register from "./pages/Register";
function App() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function getPhotos() {
      const results = await fetchPhotos("popular"); // Fetch default photos
      console.log("[DEBUG] Fetched Photos:", results); // Debugging
      setPhotos(results);
    }
    getPhotos();
  }, []);

  return (
  
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/discover" element={<DiscoveryPage photos={photos} />} />
        <Route path="/photo/:photoId" element={<PhotoDetailsPage />} />
        <Route path="/register" element={<Register />} /> 
      </Routes>
    
  );
}

export default App;