import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { deletePhoto, uploadPhoto } from "../api/client";
import photoApi from "../api/photoApi";
import "../index.css";

const options = [
  { value: "wedding", label: "Wedding" },
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "sports", label: "Sports" },
];

function ProfileDashboard() {
  const { photographerId } = useAuth();
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [preview, setPreview] = useState(null);
  const [uploadedImages, setUploadedImages] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [photoType, setPhotoType] = useState("");

  useEffect(() => {
    const loadPhotosForUser = async () => {
      if (photographerId) {
        const response = await photoApi.getPhotosByUserId(photographerId);
        if (response && response.photos) {
          const images = response.photos.map((p) => ({
            key: p.id,
            img: p.image,
          }));
          setUploadedImages(images);
        }
      }
    };

    loadPhotosForUser();
  }, []);

  const onPhotoTypeChange = (e) => {
    console.log('fuck', e.target.value)
    setPhotoType(e.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
        setPreview(reader.result);
        setFileName(file.name)
      };
      
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image to upload.");

    try {
      const res = await uploadPhoto(photographerId, image, photoType);
      if (res.success) {
        setUploadedImages([
          ...uploadedImages,
          { key: res.photo.id, img: res.photo.image },
        ]);
        setImageUrl("");
        setFileName("")
      }
    } catch (err) {
      console.error("Upload failed:", err);
    }
  };

  const handleDelete = async (id) => {
    const result = await deletePhoto(id);
    console.log(result);
    setUploadedImages(uploadedImages.filter((image) => image.key !== id));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Upload Images</h1>
      <form onSubmit={handleUpload} className="mb-4">
        <input
          type="file"
          value={imageUrl}
          accept="image/jpg"
          onChange={handleFileChange}
          placeholder="Enter image URL"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        />
        <select onChange={onPhotoTypeChange}>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {fileName && <p>File to upload: {fileName}</p>}
        <button
          type="submit"
          className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Upload
        </button>
      </form>
      <div className="grid grid-cols-3 gap-4">
        {uploadedImages.map((i) => (
          <div key={i.key} className="relative">
            <img
              src={i.img || "/placeholder.svg"}
              alt="Uploaded image"
              className="w-full h-48 object-cover"
            />
            <button
              onClick={() => handleDelete(i.key)}
              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProfileDashboard;
