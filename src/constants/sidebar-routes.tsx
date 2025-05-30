import { BarChart, CreditCard, Home, Wallet } from "lucide-react";
import type { ReactNode } from "react";

export type SidebarItemType = {
	title: string;
	icon: string | ReactNode;
	url?: string;
};

export const sidebarRoutes: SidebarItemType[] = [
	{ title: "Overview", icon: <Home />, url: "/home" },
	{ title: "Transactions", icon: <CreditCard />, url: "/transactions" },
	{ title: "Budgets", icon: <Wallet />, url: "/budget" },
	{ title: "Reports", icon: <BarChart />, url: "/reports" },
];
