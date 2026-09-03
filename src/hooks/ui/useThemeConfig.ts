import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import {
  activeThemeAtom,
  isDarkModeAtom,
  setActiveThemeAtom,
} from "~/state/atoms";

export function useThemeConfig() {
  const activeTheme = useAtomValue(activeThemeAtom);
  const isDark = useAtomValue(isDarkModeAtom);
  const setActiveTheme = useSetAtom(setActiveThemeAtom);

  return useMemo(
    () => ({
      activeTheme,
      isDark,
      setActiveTheme: (theme: string) => setActiveTheme(theme),
    }),
    [activeTheme, isDark, setActiveTheme],
  );
}
