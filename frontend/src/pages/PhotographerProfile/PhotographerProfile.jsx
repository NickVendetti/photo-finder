import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { fetchAllPhotos } from "../../api/client";
import { Camera } from "lucide-react";

function PhotographerProfile() {
  const { id } = useParams();       // photographers ID from the URL
const navigate = useNavigate();
const { isAuthenticated, userType } = useAuth();

const [photos, setPhotos] = useState([]);   // this photographers photos
const [username, setUsername] = useState("");   // their name
const [loading, setLoading] = useState(true);  // show spinner while fetching

useEffect(() => {
  const loadPhotos = async () => {
    setLoading(true);
    const allPhotos = await fetchAllPhotos();
    const mine = allPhotos.filter((photo) => photo.photographer?.id === parseInt(id)
  );
  setPhotos(mine);
  if (mine.length > 0) {
    setUsername(mine[0].photographer?.username || "Photographer");
  }
  setLoading(false);
  };

  loadPhotos();
}, [id]);

const bookingButton = userType !== "PHOTOGRAPHER" && (
    <button
      onClick={() =>
        isAuthenticated && userType === "USER"
          ? navigate(`/booking/${id}`)
          : navigate("/register?role=USER")
      }
      className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
    >
      Book a Session
    </button>
  );

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Camera size={48} className="text-indigo-600" />
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{username}</h1>
            <p className="text-gray-500">{photos.length} photos</p>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex gap-4 mb-8">
          <button
            onClick={() => navigate(-1)}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-200 transition-colors"
          >
            Back to Gallery
          </button>
          {bookingButton}
        </div>

        {/* Loading spinner */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : photos.length === 0 ? (
          /* Empty state */
          <p className="text-center text-gray-500 text-lg py-12">
            This photographer has not uploaded any photos yet.
          </p>
        ) : (
          /* Photo grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {photos.map((photo) => (
              <div key={photo.id} className="overflow-hidden rounded-lg shadow-md">
                <img
                  src={photo.imageUrl || "/placeholder.svg"}
                  alt={photo.title || "Photo"}
                  className="w-full h-64 object-cover"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default PhotographerProfile;