import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { FontValues } from "~/constants/fonts-display";
import type { SonnerPosition } from "~/types/SonnerPosition";

export type DarkModeTheme = "light" | "dark";

export const darkModeThemeAtom = atomWithStorage<DarkModeTheme>(
  "theme",
  "light"
);

export const isDarkModeAtom = atom((get) => get(darkModeThemeAtom) === "dark");

export const setDarkModeThemeAtom = atom(
  null,
  (_get, set, theme: DarkModeTheme) => {
    set(darkModeThemeAtom, theme);
  }
);

export const toggleDarkModeThemeAtom = atom(null, (get, set) => {
  const nextTheme: DarkModeTheme =
    get(darkModeThemeAtom) === "light" ? "dark" : "light";
  set(darkModeThemeAtom, nextTheme);
});

export const activeThemeAtom = atomWithStorage<string>("active_theme", "default");

export const setActiveThemeAtom = atom(
  null,
  (_get, set, theme: string) => {
    set(activeThemeAtom, theme);
  }
);

export const fontDisplayAtom = atomWithStorage<string>(
  "fontDisplay",
  FontValues.SpaceGrotesk
);

export const setFontDisplayAtom = atom(
  null,
  (_get, set, value: string) => {
    set(fontDisplayAtom, value);
  }
);

export const sonnerPositionAtom = atomWithStorage<SonnerPosition>(
  "sonner_position",
  "bottom-right"
);

export const setSonnerPositionAtom = atom(
  null,
  (_get, set, position: SonnerPosition) => {
    set(sonnerPositionAtom, position);
  }
);

export const disableTransactionHoverAtom = atomWithStorage<boolean>(
  "disable-hover",
  false
);

export const setDisableTransactionHoverAtom = atom(
  null,
  (_get, set, value: boolean) => {
    set(disableTransactionHoverAtom, value);
  }
);
