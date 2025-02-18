import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../styles/PhotoDetailsPage.css";
import { fetchPhotoDetails, fetchPhotographerDetails } from "../api/client";

const PhotoDetailsPage = () => {
  const { photoId } = useParams();
  const navigate = useNavigate();
  const [photo, setPhoto] = useState(null);
  const [photographer, setPhotographer] = useState(null);

  useEffect(() => {
    async function loadPhotoDetails() {
      try {
        const data = await fetchPhotoDetails(photoId);
        setPhoto(data);

        if (data.photographer_id) {
          const photographerData = await fetchPhotographerDetails(
            data.photographer_id
          );
          setPhotographer(photographerData);
        }
      } catch (error) {
        console.error("Error fetching photo details:", error);
      }
    }

    loadPhotoDetails();
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
