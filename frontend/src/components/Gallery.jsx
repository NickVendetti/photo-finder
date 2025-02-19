import { useState, useEffect } from "react";
import { fetchAllPhotos } from "../api/client";
import "./Gallery.css";

const Gallery = ({ onPhotoClick }) => {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      try {
        const allPhotos = await fetchAllPhotos();
        setPhotos(allPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
      setLoading(false);
    };

    loadPhotos();
  }, []);

  return (
    <div className="gallery">
      {photos.map((photo) => (
        <div
          key={photo.id}
          className="gallery-item"
          onClick={() => onPhotoClick(photo)} // Call the passed-in handler
        >
          <img
            src={photo.imageUrl}
            alt={photo.title || "Photo"}
            loading="lazy"
          />
        </div>
      ))}
      {loading && <p>Loading...</p>}
    </div>
  );
};

export default Gallery;