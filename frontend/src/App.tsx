import { useState, useCallback, useRef } from "react";
import { SideMenu } from "./components/SideMenu";
import { Slideshow } from "./components/Slideshow";
import { searchImages } from "./lib/api";

function App() {
  console.log("App component rendered");
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async () => {
    console.log("handleSearch called with query:", query);
    if (!query.trim()) return;

    // 以前の検索による進行中のfetchがあれば、それを中断します。
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 新しいリクエストのために新しいコントローラーを作成し、refに保存します。
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const fetchedImages = await searchImages(query, controller.signal);
      setImages(fetchedImages);
      setCurrentIndex(0);
    } catch (error) {
      // AbortErrorは、新しい検索が前の検索をキャンセルしたときに発生することが想定されるため、無視します。
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error fetching images:", error);
      }
    }
  };

  const advanceSlide = useCallback(() => {
    console.log("advanceSlide called");
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const handleImageError = useCallback((errorIndex: number) => {
    console.log("handleImageError called for index:", errorIndex);
    setImages((prevImages) => prevImages.filter((_, i) => i !== errorIndex));
    // エラー画像が現在の画像より前の場合、インデックスを調整する必要がある
    if (errorIndex < currentIndex) {
      setCurrentIndex(prev => prev - 1);
    } else if (errorIndex === currentIndex && errorIndex >= images.length - 1) {
      // 最後の画像を削除した場合、インデックスをリセット
      setCurrentIndex(0);
    }
  }, [currentIndex, images.length]);
 
  return (
    <div className="relative flex justify-center items-center h-screen w-screen">
      <SideMenu query={query} onQueryChange={setQuery} onSearch={handleSearch} />
      <Slideshow
        images={images}
        currentIndex={currentIndex}
        onAdvanceSlide={advanceSlide}
        onImageError={handleImageError}
      />
    </div>
  );
}

export default App;
