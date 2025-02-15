import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function DiscoveryPage({ photos = [] }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log("[DEBUG] Selected Photo:", selectedPhoto); // Check if state updates
    if (selectedPhoto) {
      setIsHovered(true);
    }
  }, [selectedPhoto]);

  const handlePhotoClick = (photo) => {
    console.log("[DEBUG] Clicked Photo:", photo); // Debugging click
    setSelectedPhoto(photo);
  };

  const handleCloseCard = () => {
    setIsHovered(false);
    setTimeout(() => setSelectedPhoto(null), 300); // Allow animation to finish before removing
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4 relative">
      {photos.length > 0 ? (
        photos.map((photo) => (
          <div
            key={photo.id}
            className="relative cursor-pointer"
            onClick={() => handlePhotoClick(photo)}
          >
            <img
              src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`}
              alt={photo.title || "Photo"}
              className={`w-full h-auto rounded-md shadow-md transition-all duration-300 ${
                selectedPhoto?.id === photo.id ? "brightness-50" : ""
              }`}
            />
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">No photos available</p>
      )}

      {/* Photographer Hover Card */}
      {selectedPhoto && (
        console.log("[DEBUG] Rendering Hover Card:", selectedPhoto),
        <div
  className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full bg-white shadow-lg p-4 border rounded-md transition-all duration-300"
>
          <button className="absolute top-2 right-2 text-gray-600" onClick={handleCloseCard}>
            ✖
          </button>
          <div className="flex items-center gap-3">
            <img
              src={selectedPhoto.photographer?.profile_picture || "/default-profile.png"}
              alt={selectedPhoto.photographer?.name || "Photographer"}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h3 className="text-lg font-semibold">{selectedPhoto.photographer?.name || "Unknown"}</h3>
              <p className="text-gray-500">{selectedPhoto.photographer?.location || "Location not available"}</p>
            </div>
          </div>
          <button
            className="mt-3 w-full bg-blue-600 text-white py-2 rounded-md"
            onClick={() => navigate(`/photographer/${selectedPhoto.photographer?.id || 1}`)}
          >
            View Profile
          </button>
        </div>
      )}
    </div>
  );
}

export default DiscoveryPage;