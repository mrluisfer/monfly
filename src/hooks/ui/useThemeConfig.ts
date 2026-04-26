import { useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
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
      setActiveTheme: (theme: string) => setActiveTheme(theme),
      isDark,
    }),
    [activeTheme, isDark, setActiveTheme]
  );
}
