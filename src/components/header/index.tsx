import { useLocation } from "@tanstack/react-router";
import { sidebarRoutes } from "~/constants/sidebar-routes";
import { SettingsDialog } from "../settings-dialog";
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
				<SettingsDialog />
			</div>
		</header>
	);
};

export default Header;
