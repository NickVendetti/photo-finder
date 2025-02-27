import { useState, useEffect } from "react";
import { fetchAllPhotos } from "../../api/client";
import "./Gallery.css";

const options = [
  { value: "wedding", label: "Wedding" },
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "sports", label: "Sports" },
];

const Gallery = ({ onPhotoClick }) => {
  const [photos, setPhotos] = useState([]);
  const [filtered, setFilteredPhotos] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadPhotos = async () => {
      setLoading(true);
      try {
        const allPhotos = await fetchAllPhotos();
        setPhotos(allPhotos);
        setFilteredPhotos(allPhotos);
      } catch (error) {
        console.error("Error fetching photos:", error);
      }
      setLoading(false);
    };

    loadPhotos();
  }, []);

  const onFilterChange = (e) => {
    if (e.target.value === "all") {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(photos.filter((p) => p.photo_type === e.target.value));
    }
  };

  return (
    <>
      <select onChange={onFilterChange}>
        <option value={"all"}>All</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="gallery">
        {filtered.map((photo) => (
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
    </>
  );
};

export default Gallery;
