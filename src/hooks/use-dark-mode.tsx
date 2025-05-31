import { useContext } from "react";
import { DarkModeContext } from "~/context/DarkModeProvider";

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error(
      "useDarkMode must be used within an DarkModeProvider"
    );
  }
  return context;
};
