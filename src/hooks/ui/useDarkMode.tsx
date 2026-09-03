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
      isDark,
      setTheme: (nextTheme: DarkModeTheme) => setTheme(nextTheme),
      theme,
      toggleDarkMode: () => toggleDarkMode(),
    }),
    [isDark, setTheme, theme, toggleDarkMode],
  );
};
