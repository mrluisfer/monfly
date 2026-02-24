import { createContext, useEffect, useState } from "react";
import type { SonnerPosition } from "~/types/SonnerPosition";

const LOCALSTORAGE_KEY = "sonner_position";

export const SonnerPositionContext = createContext<{
  position: SonnerPosition;
  setPosition: (position: SonnerPosition) => void;
}>({
  position: "top-center",
  setPosition: () => {},
});

export const SonnerPositionProvider = ({
  children,
  initialPosition = "top-center",
}: {
  children: React.ReactNode;
  initialPosition?: SonnerPosition;
}) => {
  const [position, setPositionState] = useState<SonnerPosition>(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(LOCALSTORAGE_KEY);
      if (
        stored === "top-left" ||
        stored === "top-right" ||
        stored === "bottom-left" ||
        stored === "bottom-right" ||
        stored === "top-center" ||
        stored === "bottom-center"
      ) {
        return stored;
      }
    }
    return initialPosition;
  });

  const setPosition = (pos: SonnerPosition) => {
    setPositionState(pos);
    if (typeof window !== "undefined") {
      localStorage.setItem(LOCALSTORAGE_KEY, pos);
    }
  };

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === LOCALSTORAGE_KEY && e.newValue) {
        setPositionState(e.newValue as SonnerPosition);
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  return (
    <SonnerPositionContext.Provider value={{ position, setPosition }}>
      {children}
    </SonnerPositionContext.Provider>
  );
};
