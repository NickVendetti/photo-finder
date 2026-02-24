import { useState, useEffect } from "react";
import { fetchAllPhotos } from "../../api/client";
import { Camera, Filter } from "lucide-react";

const options = [
  { value: "all", label: "All Photos" },
  { value: "wedding", label: "Wedding" },
  { value: "portrait", label: "Portrait" },
  { value: "landscape", label: "Landscape" },
  { value: "sports", label: "Sports" },
];

const Gallery = ({ onPhotoClick }) => {
  const [photos, setPhotos] = useState([]);
  const [filtered, setFilteredPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("all");

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
    const filterValue = e.target.value;
    setSelectedFilter(filterValue);
    if (filterValue === "all") {
      setFilteredPhotos(photos);
    } else {
      setFilteredPhotos(photos.filter((p) => p.photo_type === filterValue));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-gray-800">Photo Gallery</h2>
        <div className="relative">
          <Filter
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={18}
          />
          <select
            onChange={onFilterChange}
            value={selectedFilter}
            className="appearance-none bg-white border border-gray-300 rounded-md pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((photo) => (
            <div
              key={photo.id}
              className="group relative overflow-hidden rounded-lg shadow-md transition-all duration-300 hover:shadow-xl cursor-pointer"
              onClick={() => onPhotoClick(photo)}
            >
              <img
                src={photo.imageUrl || "/placeholder.svg"}
                alt={photo.title || "Photo"}
                className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-end">
                <div className="w-full p-4 text-white translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-xs uppercase tracking-wide text-indigo-300 mb-1 flex items-center">
                    <Camera size={12} className="mr-1" />
                    {photo.photo_type || "Uncategorized"}
                  </p>
                  <h3 className="text-base font-semibold truncate">
                    {photo.photographer?.username || "Photographer"}
                  </h3>
                  <p className="text-sm text-indigo-200 mt-1">View Profile →</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && filtered.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            No photos found for the selected category.
          </p>
        </div>
      )}
    </div>
  );
};

export default Gallery;
