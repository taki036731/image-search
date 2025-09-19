import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSearch = async () => {
    if (!query) return;

    try {
      const response = await fetch(`/api/search?query=${query}`);
      const data = await response.json();
      setImages(data.images);
      setCurrentIndex(0);
    } catch (error) {
      console.error("Error fetching images:", error);
    }
  };

  useEffect(() => {
    console.log('useEffect called.');
    if (images.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000);
    return () => {
      console.log('useEffect cleanup.');
      clearInterval(interval);
    }
  }, [images]);

  return (
    <div className="slideshow-container">
      <div className="search-container">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images..."
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      {images.length > 0 && (
        <img
          src={images[currentIndex]}
          alt="Slideshow"
          className="slideshow-image"
        />
      )}
    </div>
  );
}

export default App;
