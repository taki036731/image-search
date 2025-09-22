import { useEffect } from "react";

interface SlideshowProps {
  images: string[];
  currentIndex: number;
  onAdvanceSlide: () => void;
  onImageError: (index: number) => void;
}

export function Slideshow({ images, currentIndex, onAdvanceSlide, onImageError }: SlideshowProps) {
  console.log("Slideshow component rendered");
  // スライドショーのタイマー設定
  useEffect(() => {
    console.log("Slideshow timer effect triggered");
    if (images.length <= 1) return;

    const interval = setInterval(onAdvanceSlide, 3000);
    return () => clearInterval(interval);
  }, [images.length, onAdvanceSlide]);

  // 現在の画像の有効性をチェック
  useEffect(() => {
    console.log("Slideshow image validation effect triggered for index:", currentIndex);
    if (images.length === 0 || currentIndex >= images.length) return;

    const imageUrl = images[currentIndex];
    if (!imageUrl) return;

    const img = new Image();
    img.onerror = () => {
      console.warn(`Image failed to load, removing: ${imageUrl}`);
      onImageError(currentIndex);
    };
    img.src = imageUrl;
  }, [currentIndex, images, onImageError]);

  // 次の画像をプリロード
  useEffect(() => {
    console.log("Slideshow preload effect triggered for next index");
    if (images.length <= 1) return;
    const nextIndex = (currentIndex + 1) % images.length;
    const nextImageUrl = images[nextIndex];
    if (nextImageUrl) {
      const img = new window.Image();
      img.src = nextImageUrl;
    }
  }, [currentIndex, images]);

  const currentImage = images[currentIndex];
  if (!currentImage) return null;

  return (
    <img
      key={currentImage}
      src={currentImage}
      alt="Slideshow"
      className="w-full h-full object-contain animate-in fade-in duration-500"
    />
  );
}