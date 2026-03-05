import { atom } from "jotai";

const MOBILE_BREAKPOINT = 768;

export const isMobileAtom = atom(false);

isMobileAtom.onMount = (setValue) => {
  if (typeof window === "undefined") return;

  const mediaQuery = window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT - 1}px)`
  );

  const handleChange = () => {
    setValue(window.innerWidth < MOBILE_BREAKPOINT);
  };

  handleChange();
  mediaQuery.addEventListener("change", handleChange);

  return () => {
    mediaQuery.removeEventListener("change", handleChange);
  };
};
