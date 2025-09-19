import { useState, useEffect, useCallback } from "react";
import styles from "./App.module.css";

function App() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleSearch = async () => {
    if (!query.trim()) return;
    const controller = new AbortController();
    try {
      const response = await fetch(`/api/search?query=${encodeURIComponent(query)}`, { signal: controller.signal });
      const data = await response.json();
      if (!Array.isArray(data.images)) throw new Error("Invalid response");
      setImages(data.images);
      setCurrentIndex(0);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error fetching images:", error);
      }
    }
  };

  const advanceSlide = useCallback(() => {
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  useEffect(() => {
    // スライドショーのタイマー設定
    if (images.length <= 1) return; // 1枚以下の場合はスライドショー不要

    const interval = setInterval(advanceSlide, 3000);
    return () => clearInterval(interval);
  }, [images.length, advanceSlide]);

  useEffect(() => {
    // 現在の画像の有効性をチェック
    if (images.length === 0) return;

    // currentIndexが配列の範囲外になった場合、0にリセット
    if (currentIndex >= images.length) {
      setCurrentIndex(0);
      return;
    }

    const imageUrl = images[currentIndex];
    if (!imageUrl) return;

    let isCancelled = false;
    const img = new Image();
    // 画像が有効な場合は何もしない
    img.onload = () => {};
    img.onerror = () => {
      if (isCancelled) return;
      console.warn(`Image failed to load, removing: ${imageUrl}`);
      setImages((prevImages) => {
        const newImages = prevImages.filter((_, i) => i !== currentIndex);
        // currentIndexが範囲外になった場合は0にリセット
        if (currentIndex >= newImages.length && newImages.length > 0) {
          setCurrentIndex(0);
        }
        return newImages;
      });
    };
    img.src = imageUrl;

    // クリーンアップ関数
    return () => { isCancelled = true; };
  }, [currentIndex, images]); // imagesも依存配列に含めることが重要

  // 次の画像をプリロード
  useEffect(() => {
    if (images.length <= 1) return;
    const nextIndex = (currentIndex + 1) % images.length;
    const nextImageUrl = images[nextIndex];
    if (!nextImageUrl) return;
    const img = new window.Image();
    img.src = nextImageUrl;
    // クリーンアップ不要（GCに任せる）
  }, [currentIndex, images]);

  return (
    <div className={styles["slideshow-container"]}>
      <div className={styles["search-container"]}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for images..."
          className={styles["search-input"]}
        />
        <button onClick={handleSearch} className={styles["search-button"]}>
          Search
        </button>
      </div>
      {images.length > 0 && images[currentIndex] && (
        <img
          key={images[currentIndex]} // keyをsrcに連動させることで、画像が切り替わる際に再マウントを促す
          src={images[currentIndex]}
          alt="Slideshow"
          className={styles["slideshow-image"]}
        />
      )}
    </div>
  );
}

export default App;
