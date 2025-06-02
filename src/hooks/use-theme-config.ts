import { useContext } from "react";
import { ThemeContext } from "~/context/theme-provider";

export function useThemeConfig() {
	const context = useContext(ThemeContext);
	if (context === undefined) {
		throw new Error(
			"useThemeConfig must be used within an ActiveThemeProvider",
		);
	}
	return context;
}
