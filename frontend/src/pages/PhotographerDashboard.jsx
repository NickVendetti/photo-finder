import { useEffect, useState, useRef } from "react";
import { useAuth } from "../hooks/useAuth";
import { deletePhoto, uploadPhoto } from "../api/client";
import photoApi from "../api/photoApi";
import { PlusCircle, Trash2 } from "lucide-react";

const photoTypes = [
  { value: "wedding", label: "Wedding" },
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "sports", label: "Sports" },
];

function ProfileDashboard() {
  const { photographerId } = useAuth();
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadedImages, setUploadedImages] = useState([]);
  const [photoType, setPhotoType] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const fileInputRef = useRef(null);

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
  }, [photographerId]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setImage(reader.result);
        setFileName(file.name);
      };
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!image) return alert("Please select an image to upload.");

    try {
      setIsUploading(true);
      const res = await uploadPhoto(photographerId, image, photoType);
      if (res.success) {
        setUploadedImages([
          ...uploadedImages,
          { key: res.photo.id, img: res.photo.image },
        ]);
        setFileName("");
        setImage(null);
        setPhotoType("");
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setUploadSuccess(true);
        setTimeout(() => setUploadSuccess(false), 3000);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      alert("Upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deletePhoto(id);
      setUploadedImages(uploadedImages.filter((image) => image.key !== id));
    } catch (error) {
      console.error("Delete failed:", error);
      alert("Delete failed. Please try again.");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl mx-32 font-bold mb-8 text-gray-800">Dashboard</h1>

      <div className="bg-white shadow-md rounded-lg p-6 mx-32 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Upload New Image
        </h2>
        <form onSubmit={handleUpload} className="space-y-4">
          <div>
            <label
              htmlFor="file-upload"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Choose an image
            </label>
            <input
              id="file-upload"
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-primary-50 file:text-primary-700
                hover:file:bg-primary-100"
            />
          </div>

          <div>
            <label
              htmlFor="photo-type"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Photo Type
            </label>
            <select
              id="photo-type"
              value={photoType}
              onChange={(e) => setPhotoType(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm rounded-md"
            >
              <option value="">Select a type</option>
              {photoTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {fileName && (
            <p className="text-sm text-gray-600">File to upload: {fileName}</p>
          )}

          {uploadSuccess && (
            <div className="text-sm text-green-600 bg-green-100 p-2 rounded">
              Image uploaded successfully!
            </div>
          )}

          <button
            type="submit"
            disabled={isUploading || !image || !photoType}
            className={`flex items-center justify-center w-full px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 ${
              (isUploading || !image || !photoType) &&
              "opacity-50 cursor-not-allowed"
            }`}
          >
            <PlusCircle className="w-5 h-5 mr-2" />
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>

      <div className="mx-32">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Uploaded photos
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {uploadedImages.map((image) => (
            <div key={image.key} className="relative group">
              <img
                src={image.img || "/placeholder.svg"}
                alt="Uploaded image"
                className="w-full h-48 object-cover rounded-lg shadow-md"
              />
              <button
                onClick={() => handleDelete(image.key)}
                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProfileDashboard;
