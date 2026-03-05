import { useContext } from "react";
import { SonnerPositionContext } from "~/context/sonner-position-provider";

export const useSonnerPosition = () => {
  const context = useContext(SonnerPositionContext);

  if (!context) {
    throw new Error(
      "useSonnerPosition must be used within a SonnerPositionProvider"
    );
  }

  return context;
};
