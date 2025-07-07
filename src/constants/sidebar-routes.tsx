import type { ReactNode } from "react";
import { BarChart, CreditCard, Home, List, Wallet } from "lucide-react";

export type SidebarItemType = {
  title: string;
  icon: string | ReactNode;
  url?: string;
  disabled?: boolean;
};

export enum SidebarRouteUrl {
  HOME = "/home",
  TRANSACTIONS = "/transactions",
  BUDGET = "/budget",
  REPORTS = "/reports",
  CATEGORIES = "/categories",
}

export const sidebarRoutes: SidebarItemType[] = [
  { title: "Home", icon: <Home />, url: SidebarRouteUrl.HOME },
  {
    title: "Transactions",
    icon: <CreditCard />,
    url: SidebarRouteUrl.TRANSACTIONS,
  },
  {
    title: "Budgets",
    icon: <Wallet />,
    url: SidebarRouteUrl.BUDGET,
    disabled: true,
  },
  { title: "Reports", icon: <BarChart />, url: SidebarRouteUrl.REPORTS },
  { title: "Categories", icon: <List />, url: SidebarRouteUrl.CATEGORIES },
];
