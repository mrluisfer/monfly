import { Link, useLocation } from "@tanstack/react-router";
import { ArrowLeft, Settings } from "lucide-react";
import { sidebarRoutes } from "~/constants/sidebar-routes";
import { ThemeSelector } from "../theme-selector";
import ToggleDarkMode from "../toggleDarkMode";
import { Button } from "../ui/button";
import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
	const location = useLocation();

	return (
		<header className="flex justify-between items-center mb-4">
			<div className="flex items-center gap-2">
				<SidebarTrigger />

				{/* {!open && <Navigation />} */}
				<span>
					{
						sidebarRoutes.find((route) => route.url === location.pathname)
							?.title
					}
				</span>
			</div>
			<div className="flex items-center gap-2">
				<ThemeSelector />
				<Button variant="outline">
					<Settings />
				</Button>
				<ToggleDarkMode />
			</div>
		</header>
	);
};

export const GlobalHeader = () => {
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

export default Header;
