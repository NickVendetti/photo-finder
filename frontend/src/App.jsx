import React, { useEffect, useState } from "react";
import fetchPhotos from "./api/flickrApi";

function App() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function getPhotos() {
      const results = await fetchPhotos("3d girl"); // Search for 'sunset' photos
      setPhotos(results);
    }
    getPhotos();
  }, []);
  
  return (
    <div>
      <h1>Photo Finder</h1>
      <ul>
        {photos.map((photo) =>(
          <li key={photo.id}>
            <img src={`https://live.staticflickr.com/${photo.server}/${photo.id}_${photo.secret}_q.jpg`}
            alt={photo.title}
            />
            <p>{photo.title}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;