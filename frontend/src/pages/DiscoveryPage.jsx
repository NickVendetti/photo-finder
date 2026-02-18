import { useNavigate } from "react-router-dom";
import Gallery from "../components/Gallery/Gallery";
import { useAuth } from "../context/AuthContext";

function DiscoveryPage() {
  const navigate = useNavigate();
  const { userType } = useAuth();

  const handlePhotoClick = (photo) => {
    if (userType === "USER" && photo.photographer?.id) {
      navigate(`/booking/${photo.photographer.id}`);
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">
          Discover Amazing Photography
        </h1>
        <p className="text-xl text-gray-600 mb-12 text-center">
          {userType === "PHOTOGRAPHER"
            ? "Browse the gallery to see what other photographers are capturing"
            : "Explore our collection and book your next photoshoot"}
        </p>
        <Gallery onPhotoClick={handlePhotoClick} />
      </div>
    </div>
  );
}

export default DiscoveryPage;
