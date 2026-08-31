import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import {
  type DarkModeTheme,
  darkModeThemeAtom,
  isDarkModeAtom,
  setDarkModeThemeAtom,
  toggleDarkModeThemeAtom,
} from "~/state/atoms";

export const useDarkMode = () => {
  const theme = useAtomValue(darkModeThemeAtom);
  const isDark = useAtomValue(isDarkModeAtom);
  const setTheme = useSetAtom(setDarkModeThemeAtom);
  const toggleDarkMode = useSetAtom(toggleDarkModeThemeAtom);

  return useMemo(
    () => ({
      theme,
      setTheme: (nextTheme: DarkModeTheme) => setTheme(nextTheme),
      toggleDarkMode: () => toggleDarkMode(),
      isDark,
    }),
    [isDark, setTheme, theme, toggleDarkMode],
  );
};
