import type { SonnerPosition } from "~/types/SonnerPosition";

export const sonnerPositions: { value: SonnerPosition; name: string }[] = [
  { name: "Top Left", value: "top-left" },
  { name: "Top Right", value: "top-right" },
  { name: "Bottom Left", value: "bottom-left" },
  { name: "Bottom Right", value: "bottom-right" },
  { name: "Top Center", value: "top-center" },
  { name: "Bottom Center", value: "bottom-center" },
];
