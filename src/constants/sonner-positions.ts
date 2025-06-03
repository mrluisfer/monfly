import type { SonnerPosition } from "~/types/SonnerPosition";

export const sonnerPositions: { value: SonnerPosition; name: string }[] = [
  { value: "top-left", name: "Top Left" },
  { value: "top-right", name: "Top Right" },
  { value: "bottom-left", name: "Bottom Left" },
  { value: "bottom-right", name: "Bottom Right" },
  { value: "top-center", name: "Top Center" },
  { value: "bottom-center", name: "Bottom Center" },
];
