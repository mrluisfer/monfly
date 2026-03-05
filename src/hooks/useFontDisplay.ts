import { useContext } from "react";
import { FontDisplayContext } from "~/context/font-display-provider";

export const useFontDisplay = () => {
  const context = useContext(FontDisplayContext);
  if (!context) {
    console.error(
      "FontDisplayContext is undefined. Make sure useFontDisplay is called within a FontDisplayProvider."
    );
    throw new Error("useFontDisplay must be used within a FontDisplayProvider");
  }
  return context;
};
