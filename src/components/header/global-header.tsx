import { Link } from "@tanstack/react-router";

import { useLocation } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { ThemeSelector } from "../theme-selector";
import ToggleDarkMode from "../toggle-dark-mode";
import { Button } from "../ui/button";

const GlobalHeader = () => {
	const location = useLocation();
	const isHome = location.pathname === "/";

	return (
		<header className="flex justify-between items-center">
			<div>
				{!isHome && (
					<Button variant="link" asChild>
						<Link to="/">
							<ArrowLeft />
							Go to home
						</Link>
					</Button>
				)}
			</div>
			<div className="flex items-center gap-2">
				<ThemeSelector />
				<ToggleDarkMode />
			</div>
		</header>
	);
};

export default GlobalHeader;
