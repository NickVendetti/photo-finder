import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";

function ProfileDashboard() {
  const { photographerId } = useAuth();
console.log(photographerId);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);

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
      const res = await axios.post("http://localhost:5000/api/photos/upload", {
        photographer_id: photographerId, // Replace with actual logged-in user ID
        image,
      });

      if (res.data.success) {
        setUploadedImages([...uploadedImages, res.data.photo.image]);
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