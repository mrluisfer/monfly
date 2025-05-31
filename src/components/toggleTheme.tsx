import { Moon, Sun } from "lucide-react";
import { useTheme } from "~/context/DarkModeProvider";
import { Button } from "./ui/button";

export default function ToggleTheme() {
	const { toggleTheme, theme } = useTheme();

	return (
		<Button type="button" onClick={toggleTheme} variant="outline">
			{theme === "dark" ? <Sun /> : <Moon />}
		</Button>
	);
}
