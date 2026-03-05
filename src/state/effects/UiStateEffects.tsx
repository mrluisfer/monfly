import { useEffect } from "react";
import { useAtom, useAtomValue } from "jotai";
import { activeThemeAtom, darkModeThemeAtom } from "~/state/atoms";

function syncThemeClass(theme: "light" | "dark") {
  if (typeof window === "undefined") return;
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function UiStateEffects() {
  const [theme, setTheme] = useAtom(darkModeThemeAtom);
  const activeTheme = useAtomValue(activeThemeAtom);

  useEffect(() => {
    syncThemeClass(theme);
  }, [theme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const root = document.documentElement;
    root.setAttribute("data-theme", activeTheme);

    for (const cls of Array.from(root.classList)) {
      if (cls.startsWith("theme-")) {
        root.classList.remove(cls);
      }
    }

    root.classList.add(`theme-${activeTheme}`);
  }, [activeTheme]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const hasStoredTheme = window.localStorage.getItem("theme") !== null;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

    if (!hasStoredTheme) {
      setTheme(mediaQuery.matches ? "dark" : "light");
    }

    const handleMediaQueryChange = (event: MediaQueryListEvent) => {
      if (window.localStorage.getItem("theme") === null) {
        setTheme(event.matches ? "dark" : "light");
      }
    };

    mediaQuery.addEventListener("change", handleMediaQueryChange);
    return () =>
      mediaQuery.removeEventListener("change", handleMediaQueryChange);
  }, [setTheme]);

  return null;
}
