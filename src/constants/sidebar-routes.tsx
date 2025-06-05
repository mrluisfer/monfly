import type { ReactNode } from "react";
import { BarChart, CreditCard, Home, List, Wallet } from "lucide-react";

export type SidebarItemType = {
  title: string;
  icon: string | ReactNode;
  url?: string;
};

export const sidebarRoutes: SidebarItemType[] = [
  { title: "Home", icon: <Home />, url: "/home" },
  { title: "Transactions", icon: <CreditCard />, url: "/transactions" },
  { title: "Budgets", icon: <Wallet />, url: "/budget" },
  { title: "Reports", icon: <BarChart />, url: "/reports" },
  { title: "Categories", icon: <List />, url: "/categories" },
];
