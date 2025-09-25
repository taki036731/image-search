import { useState, useCallback, useRef, useEffect } from "react";
import {
  onAuthStateChanged,
  signInWithPopup,
  // リダイレクトは制約が多いため、いったん見送り
  //  signInWithRedirect,
  //  getRedirectResult,
} from "firebase/auth";
import type { User } from "firebase/auth";
import { SideMenu } from "./components/SideMenu";
import { Slideshow } from "./components/Slideshow";
import { searchImages } from "./lib/api";
import { useSettings } from "./contexts/SettingsContext";
import { auth, googleProvider } from "./lib/firebaseConfig";

function App() {
  console.log("App component rendered");
  const [user, setUser] = useState<User | null>(null);
  const [query, setQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { numImages } = useSettings();

  const [images, setImages] = useState<string[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    console.log("Setting up auth state listener");
    // リダイレクトは制約が多いため、いったん見送り
    //   getRedirectResult(auth)
    //     .then((result) => {
    //       console.log("Redirect result:", result);
    //       if (result) {
    //         setUser(result.user);
    //       }
    //     })
    //     .catch((error) => {
    //       console.error("Error during redirect sign-in:", error);
    //     });

    onAuthStateChanged(auth, (currentUser) => {
      console.log("Auth state changed:", currentUser);
      setUser(currentUser);
    });
  }, []);

  const handleLogin = async () => {
    // リダイレクトは制約が多いため、いったん見送り
    // await signInWithRedirect(auth, googleProvider);
    await signInWithPopup(auth, googleProvider);
  };

  const handleSearch = async () => {
    console.log("handleSearch called with query:", query);
    if (!query.trim() || !user || isLoading) return;

    // 以前の検索による進行中のfetchがあれば、それを中断します。
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // 新しいリクエストのために新しいコントローラーを作成し、refに保存します。
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsLoading(true);
    try {
        const idToken = await user.getIdToken();
        console.log("ID Token:", idToken);
        const fetchedImages = await searchImages(
        query,
        idToken,
        controller.signal,
        numImages
      );
      setImages(fetchedImages);
      setCurrentIndex(0);
    } catch (error) {
      if (error instanceof Error && error.name !== "AbortError") {
        console.error("Error fetching images:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const advanceSlide = useCallback(() => {
    console.log("advanceSlide called");
    if (images.length === 0) return;
    setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
  }, [images.length]);

  const handleImageError = useCallback(
    (errorIndex: number) => {
      console.log("handleImageError called for index:", errorIndex);
      setImages((prevImages) => prevImages.filter((_, i) => i !== errorIndex));
      // エラー画像が現在の画像より前の場合、インデックスを調整する必要がある
      if (errorIndex < currentIndex) {
        setCurrentIndex((prev) => prev - 1);
      } else if (
        errorIndex === currentIndex &&
        errorIndex >= images.length - 1
      ) {
        // 最後の画像を削除した場合、インデックスをリセット
        setCurrentIndex(0);
      }
    },
    [currentIndex, images.length]
  );

  if (!user) {
    return (
      <div className="flex flex-col justify-center items-center h-screen">
        <h1 className="text-3xl mb-4">Welcome to Image Search App</h1>
        <button
          onClick={handleLogin}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Sign in with Google
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex justify-center items-center h-screen w-screen">
      <SideMenu
        query={query}
        onQueryChange={setQuery}
        onSearch={handleSearch}
        isLoading={isLoading}
      />
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
