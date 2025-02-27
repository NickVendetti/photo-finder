import { useNavigate } from "react-router-dom";
import Gallery from "../components/Gallery/Gallery";

function DiscoveryPage() {
  const navigate = useNavigate();

  const handlePhotoClick = (photo) => {
    if (photo.user?.id) {
      navigate(`/booking/${photo.user.id}`);
    }
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Discover Amazing Photography
      </h1>

      <Gallery onPhotoClick={handlePhotoClick} />
    </div>
  );
}

export default DiscoveryPage;
