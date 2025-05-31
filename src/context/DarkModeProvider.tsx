import {
	createContext,
	useCallback,
	useContext,
	useEffect,
	useState,
} from "react";

export type DarkMode = "light" | "dark";

const applyThemeClass = (themeToApply: DarkMode) => {
	if (typeof window !== "undefined") {
		document.documentElement.classList.toggle("dark", themeToApply === "dark");
	}
};

const DarkModeContext = createContext<{
	theme: DarkMode;
	setTheme: (theme: DarkMode) => void;
	toggleDarkMode: () => void;
}>({
	theme: "light",
	setTheme: () => {},
	toggleDarkMode: () => {},
});

export const DarkModeProvider = ({
	children,
}: { children: React.ReactNode }) => {
	const [theme, setThemeState] = useState<DarkMode>("light");

	const setTheme = useCallback((t: DarkMode) => {
		setThemeState(t);
		if (typeof window !== "undefined") {
			localStorage.setItem("theme", t);
			applyThemeClass(t);
		}
	}, []);

	const toggleDarkMode = () => {
		setTheme(theme === "light" ? "dark" : "light");
	};

	useEffect(() => {
		if (typeof window === "undefined") return;

		const stored = localStorage.getItem("theme") as DarkMode | null;
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
		<DarkModeContext.Provider value={{ theme, setTheme, toggleDarkMode }}>
			{children}
		</DarkModeContext.Provider>
	);
};

export const useDarkMode = () => useContext(DarkModeContext);
