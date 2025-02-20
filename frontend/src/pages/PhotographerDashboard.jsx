import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { uploadPhoto } from "../api/client";
import photoApi from "../api/photoApi";

function ProfileDashboard() {
  const { photographerId } = useAuth();
  console.log(photographerId);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

  useEffect(() => {
    const loadPhotosForUser = async () => {
      if (photographerId) {
        const response = await photoApi.getPhotosByUserId(photographerId);
        if (response && response.photos) {
          const images = response.photos.map((p) => p.image);
          setUploadedImages(images);
        }
      }
    };

    loadPhotosForUser();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result); // Convert image to Base64
        setPreview(reader.result);
      };
    }
  };

  const handleUpload = async () => {
    if (!image) return alert("Please select an image to upload.");

    try {
      const res = await uploadPhoto(photographerId, image);

      if (res.success) {
        setUploadedImages([...uploadedImages, res.photo.image]);
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>Welcome to Your Photographer Dashboard</h2>
      <p>Manage your profile and uploaded photos.</p>

      <input type="file" onChange={handleFileChange} />
      {preview && <img src={preview} alt="Preview" width="150" />}
      <button onClick={handleUpload}>Upload</button>

      <div>
        <h3>Uploaded Images:</h3>
        {uploadedImages.map((img, index) => (
          <img key={index} src={img} alt="Uploaded" width="200" />
        ))}
      </div>
    </div>
  );
}

export default ProfileDashboard;
