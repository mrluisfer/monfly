import { Settings } from "lucide-react";
import ToggleTheme from "../toggleTheme";
import { Button } from "../ui/button";
import { SidebarTrigger, useSidebar } from "../ui/sidebar";
import Navigation from "./navigation";

const Header = () => {
	const { open } = useSidebar();

	return (
		<header className="flex justify-between items-center mb-4">
			<div className="flex items-center gap-2">
				<SidebarTrigger />
				{!open && <Navigation />}
			</div>
			<div className="flex items-center gap-2">
				<Button>
					<Settings />
				</Button>
				<ToggleTheme />
			</div>
		</header>
	);
};

export default Header;
