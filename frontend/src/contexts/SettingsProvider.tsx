import type { ReactNode } from "react";
import { useCookieState } from "@/hooks/useCookieState";
import { SettingsContext } from "./SettingsContext";


export function SettingsProvider({ children }: { children: ReactNode }) {
  const [interval, setInterval] = useCookieState("slideshowInterval", 3000);
  const [animation, setAnimation] = useCookieState("slideshowAnimation", "fade-in");
  const [numImages, setNumImages] = useCookieState("slideshowNumImages", 20);

  const value = {
    interval,
    setInterval,
    animation,
    setAnimation,
    numImages,
    setNumImages,
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
}