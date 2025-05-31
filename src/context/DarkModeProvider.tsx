import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

export type Theme = "light" | "dark";

const applyThemeClass = (themeToApply: Theme) => {
	if (typeof window !== "undefined") {
		document.documentElement.classList.toggle("dark", themeToApply === "dark");
	}
};

const ThemeContext = createContext<{
	theme: Theme;
	setTheme: (theme: Theme) => void;
	toggleTheme: () => void;
}>({
	theme: "light",
	setTheme: () => {},
	toggleTheme: () => {},
});

export const DarkModeProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const [theme, setThemeState] = useState<Theme>("light");

	const setTheme = useCallback((t: Theme) => {
		setThemeState(t);
		if (typeof window !== "undefined") {
			localStorage.setItem("theme", t);
			applyThemeClass(t);
		}
	}, []);

	const toggleTheme = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	useEffect(() => {
		if (typeof window === "undefined") return;

		const stored = localStorage.getItem("theme") as Theme | null;
		const prefersDark = window.matchMedia(
			"(prefers-color-scheme: dark)",
		).matches;
		const initial = stored ?? (prefersDark ? "dark" : "light");
		setTheme(initial);

		const mq = window.matchMedia("(prefers-color-scheme: dark)");
		const handleChange = (e: MediaQueryListEvent) => {
			if (!localStorage.getItem("theme")) {
				setTheme(e.matches ? "dark" : "light");
			}
		};
		mq.addEventListener("change", handleChange);
		return () => mq.removeEventListener("change", handleChange);
	}, [setTheme]);

	return (
		<ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
			{children}
		</ThemeContext.Provider>
	);
};

export const useTheme = () => useContext(ThemeContext);
