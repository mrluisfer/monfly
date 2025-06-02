import { type ReactNode, createContext, useEffect, useState } from "react";
import { useDarkMode } from "~/hooks/use-dark-mode";

const THEME_STORAGE_KEY = "active_theme";
const DEFAULT_THEME = "default";

function setThemeLocal(theme: string) {
	if (typeof window === "undefined") return;
	window.localStorage.setItem(THEME_STORAGE_KEY, theme);
}

function getThemeLocal(): string | null {
	if (typeof window === "undefined") return null;
	return window.localStorage.getItem(THEME_STORAGE_KEY);
}

type ThemeContextType = {
	activeTheme: string;
	setActiveTheme: (theme: string) => void;
	isDark: boolean;
};

export const ThemeContext = createContext<ThemeContextType | undefined>(
	undefined,
);

export function ActiveThemeProvider({
	children,
	initialTheme,
	initialDark,
}: {
	children: ReactNode;
	initialTheme?: string;
	initialDark?: boolean;
}) {
	const [activeTheme, setActiveThemeState] = useState<string>(() => {
		return getThemeLocal() || initialTheme || DEFAULT_THEME;
	});

	const { isDark } = useDarkMode();

	useEffect(() => {
		setThemeLocal(activeTheme);

		if (typeof window !== "undefined") {
			document.documentElement.setAttribute("data-theme", activeTheme);

			document.documentElement.classList.remove(
				...Array.from(document.documentElement.classList).filter((c) =>
					c.startsWith("theme-"),
				),
			);
			document.documentElement.classList.add(`theme-${activeTheme}`);

			if (isDark) {
				document.documentElement.classList.add("dark");
			} else {
				document.documentElement.classList.remove("dark");
			}
		}
	}, [activeTheme, isDark]);

	const setActiveTheme = (theme: string) => {
		setActiveThemeState(theme);
		setThemeLocal(theme);
	};

	return (
		<ThemeContext.Provider value={{ activeTheme, setActiveTheme, isDark }}>
			{children}
		</ThemeContext.Provider>
	);
}
