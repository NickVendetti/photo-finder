import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/PhotoDetailsPage.css";

const PhotoDetailsPage = () => {
  const { photoId } = useParams(); // Get the photo ID from URL
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [photographer, setPhotographer] = useState(null);

  useEffect(() => {
    async function fetchPhotoDetails() {
      try {
        const response = await fetch(`http://localhost:5000/api/photos/${photoId}`);
        const data = await response.json();
        setPhoto(data);

        // Fetch photographer details
        if (data.photographer_id) {
          const photographerResponse = await fetch(
            `http://localhost:5000/api/photographers/${data.photographer_id}`
          );
          const photographerData = await photographerResponse.json();
          setPhotographer(photographerData);
        }
      } catch (error) {
        console.error("Error fetching photo details:", error);
      }
    }

    fetchPhotoDetails();
  }, [photoId]);

  if (!photo) return <p>Loading photo details...</p>;

  return (
    <div className="photo-details-container">
      <h1>{photo.title}</h1>
      <img src={photo.image_url} alt={photo.title} className="photo-large" />

      {photographer && (
        <div className="photographer-info">
          <h2>Photographer: {photographer.username}</h2>
          <p>{photographer.bio}</p>
          <button onClick={() => navigate(`/photographer/${photographer.id}`)}>
            View Photographer Profile
          </button>
          <button onClick={() => navigate(`/book/${photographer.id}`)}>
            Book a Session
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoDetailsPage;