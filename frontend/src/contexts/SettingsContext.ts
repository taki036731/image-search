import { createContext } from "react";
import { useContext } from "react";

interface SettingsContextType {
  interval: number;
  setInterval: (value: number) => void;
  animation: string;
  setAnimation: (value: string) => void;
  numImages: number;
  setNumImages: (value: number) => void;
}

export const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}