import { Link, useNavigate, useRouter } from "@tanstack/react-router";
import clsx from "clsx";
import {
	ArrowRight,
	BarChart,
	ChevronDown,
	ChevronRight,
	ChevronUp,
	CreditCard,
	Home,
	LogOut,
	Settings,
	User2,
	Wallet,
} from "lucide-react";
import type { ReactNode } from "react";
import { logoutFn } from "~/utils/auth/logoutfn";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "../ui/collapsible";
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
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuAction,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarProvider,
	Sidebar as UiSidebar,
} from "../ui/sidebar";
import Title from "../ui/title";
import OverviewSection from "./overview-section";

type SidebarItemType = {
	title: string;
	icon: string | ReactNode;
	url?: string;
};

const sidebarItems: SidebarItemType[] = [
	{ title: "Overview", icon: <Home />, url: "/home" },
	{ title: "Transactions", icon: <CreditCard />, url: "/transactions" },
	{ title: "Budgets", icon: <Wallet />, url: "/budget" },
	{ title: "Reports", icon: <BarChart />, url: "/reports" },
];

const sidebarFooterItems: SidebarItemType[] = [
	{ title: "Help", icon: "❓", url: "/help" },
	{ title: "Settings", icon: <Settings />, url: "/settings" },
];

const Sidebar = () => {
	const { state } = useRouter();
	const currentPath = state.location.pathname;
	const navigate = useNavigate();

	const handleLogOut = async () => {
		await logoutFn({
			data: { destination: "/login", manualRedirect: true },
		});
		await navigate({
			to: "/login",
		});
	};

	return (
		<UiSidebar>
			<SidebarHeader>
				<Title>Finance</Title>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup>
					<SidebarGroupContent>
						<SidebarMenu>
							{sidebarItems.map((item) => (
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
								<SidebarMenuButton>
									<User2 /> Username
									<ChevronUp className="ml-auto" />
								</SidebarMenuButton>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="top"
								className="w-[--radix-popper-anchor-width]"
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
