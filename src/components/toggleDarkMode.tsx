import { Moon, Sun } from "lucide-react";
import { useDarkMode } from "~/context/DarkModeProvider";
import { Button } from "./ui/button";

export default function ToggleDarkMode() {
	const { toggleDarkMode, theme } = useDarkMode();

	return (
		<Button type="button" onClick={toggleDarkMode} variant="outline">
			{theme === "dark" ? <Sun /> : <Moon />}
		</Button>
	);
}
