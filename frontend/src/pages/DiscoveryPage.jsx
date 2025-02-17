import React from "react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

function DiscoveryPage() {
  const [photos, setPhotos] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchAllPhotos() {
      try {
        const response = await fetch(`http://localhost:5000/api/photos/`);
        const data = await response.json();
        console.log(data);

        const processedPhotos = data.images.map(photo => ({
          ...photo,
        
          // Create a proper data URL by adding the MIME type prefix
          imageUrl: `${photo.image}`
          // If your base64 string already includes the prefix, you can use it directly:
          // imageUrl: photo.image
        }));

        setPhotos(processedPhotos);
        // need to do something to turn base64 string into an image that I can display on page.
        // setPhotos(data.image);
        
      } catch (error) {
        console.error("Error fetching photo details:", error);
      }
    }

    fetchAllPhotos();
  }, []);
  
  const handlePhotoClick = (photo) => {
    console.log("[DEBUG] Clicked Photo:", photo); // Debugging click
    if (photo.user.id){
      navigate(`/booking/${photo.user.id}`);
    }
    
    // if (photo.photographer?.id) {
    //   navigate(`/photographer/${photo.photographer.id}`);
    // } else {
    //   console.error("No photographer ID found for this photo.");
    // }
  };

  return (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 p-4">
      {photos.length > 0 ? (
        photos.map((photo) => (
          <div
            key={photo.id}
            className="cursor-pointer relative h-64 w-64"
            onClick={() => handlePhotoClick(photo)}
          >
            <img
              // Use the processed base64 image URL
              src={photo.imageUrl}
              alt="Photographer's work"
              className="absolute inset-0 w-full h-full object-cover rounded-md shadow-md transition-all duration-300 hover:opacity-80"
            />
          </div>
        ))
      ) : (
        <p className="col-span-full text-center text-gray-500">No photos available</p>
      )}
    </div>
  );
}

export default DiscoveryPage;