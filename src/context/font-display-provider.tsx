import { createContext, ReactNode, useEffect, useState } from "react";
import { FontValues } from "~/constants/fonts-display";

type FontDisplayContextType = {
  fontDisplay: string;
  setFontDisplay: (value: string) => void;
  onChangeFontDisplay: (value: string) => void;
};

export const FontDisplayContext = createContext<
  FontDisplayContextType | undefined
>(undefined);

const LOCAL_STORAGE_KEY = "fontDisplay";

export const FontDisplayProvider = ({ children }: { children: ReactNode }) => {
  const [fontDisplay, setFontDisplayState] = useState<string>(() => {
    // Check localStorage for saved value
    if (typeof window !== "undefined") {
      return localStorage.getItem(LOCAL_STORAGE_KEY) || FontValues.OpenSans;
    }
    return FontValues.OpenSans;
  });

  // Sync with localStorage whenever value changes
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCAL_STORAGE_KEY, fontDisplay);
    }
  }, [fontDisplay]);

  const setFontDisplay = (value: string) => {
    setFontDisplayState(value);
  };

  const onChangeFontDisplay = (value: string) => {
    setFontDisplayState(value);
  };

  return (
    <FontDisplayContext.Provider
      value={{ fontDisplay, setFontDisplay, onChangeFontDisplay }}
    >
      {children}
    </FontDisplayContext.Provider>
  );
};
