import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { ChevronUp, LogOut, Settings, User2 } from "lucide-react";
import {
	type SidebarItemType,
	sidebarRoutes,
} from "~/constants/sidebar-routes";
import { useRouteUser } from "~/hooks/use-route-user";
import { useUser } from "~/hooks/use-user";
import { logoutFn } from "~/utils/auth/logoutfn";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	Sidebar as UiSidebar,
} from "../ui/sidebar";

const sidebarFooterItems: SidebarItemType[] = [
	{ title: "Help", icon: "❓", url: "/help" },
	{ title: "Settings", icon: <Settings />, url: "/settings" },
];

const Sidebar = () => {
	const location = useLocation();
	const currentPath = location.pathname;
	const navigate = useNavigate();
	const { email } = useRouteUser();
	const { data: user } = useUser(email);

	const handleLogOut = async () => {
		await logoutFn({
			data: { destination: "/login", manualRedirect: true },
		});
		await navigate({
			to: "/login",
		});
	};

	return (
		<UiSidebar collapsible="icon">
			<SidebarHeader>
				<h1 className="text-2xl font-bold">Finance</h1>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{sidebarRoutes.map((item) => (
								<SidebarMenuItem key={item.title}>
									<SidebarMenuButton
										asChild
										isActive={currentPath === item.url}
									>
										<Link to={item.url} href={item.url}>
											{item.icon} {item.title}
										</Link>
									</SidebarMenuButton>
								</SidebarMenuItem>
							))}
						</SidebarMenu>
					</SidebarGroupContent>
				</SidebarGroup>
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter>
				<SidebarMenu>
					<SidebarMenuItem>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton className="capitalize">
									<User2 /> {user?.name}
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-(--radix-popper-anchor-width)"
							>
								{sidebarFooterItems.map((item) => (
									<DropdownMenuItem key={item.title} asChild>
										<Link to={item.url} href={item.url}>
											{item.icon} {item.title}
										</Link>
									</DropdownMenuItem>
								))}
								<DropdownMenuItem onClick={handleLogOut}>
									<LogOut />
									<span>Sign out</span>
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarFooter>
		</UiSidebar>
	);
};

export default Sidebar;
