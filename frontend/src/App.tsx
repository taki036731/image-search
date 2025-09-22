import { useState, useEffect, useCallback, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";

function App() {
  const [query, setQuery] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  const handleSearch = async () => {
    if (!query.trim()) return;

    // 以前の検索による進行中のfetchがあれば、それを中断します。
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 新しいリクエストのために新しいコントローラーを作成し、refに保存します。
    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const response = await fetch(
        `/api/search?query=${encodeURIComponent(query)}`,
        { signal: controller.signal }
      );
      const data = await response.json();
      if (!Array.isArray(data.images)) throw new Error("Invalid response");
      setImages(data.images);
      setCurrentIndex(0);
    } catch (error) {
      // AbortErrorは、新しい検索が前の検索をキャンセルしたときに発生することが想定されるため、無視します。
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
      setImages((prevImages) =>
        prevImages.filter((_, i) => i !== currentIndex)
      );
    };
    img.src = imageUrl;

    // クリーンアップ関数
    return () => {
      isCancelled = true;
    };
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
    <div className="relative flex justify-center items-center h-screen w-screen">
      <div className="absolute top-5 left-5 z-20">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Image Search</SheetTitle>
              <SheetDescription>
                Enter a search term to start the slideshow.
              </SheetDescription>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              <div className="flex w-full items-center px-2">
                <Input
                  id="search"
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for images..."
                  className="rounded-r-none focus-visible:ring-offset-0"
                />
                <Button onClick={handleSearch} className="rounded-l-none">
                  Search
                </Button>
              </div>
              <div className="grid gap-2">
                <a href="#" className="p-2 hover:bg-accent rounded-md">Home</a>
                <a href="#" className="p-2 hover:bg-accent rounded-md">Settings</a>
                <a href="#" className="p-2 hover:bg-accent rounded-md">Profile</a>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
      {images.length > 0 && images[currentIndex] && (
        <img
          key={images[currentIndex]} // keyをsrcに連動させることで、画像が切り替わる際に再マウントを促す
          src={images[currentIndex]}
          alt="Slideshow"
          className="w-full h-full object-contain animate-in fade-in duration-500"
        />
      )}
    </div>
  );
}

export default App;
