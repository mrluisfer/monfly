import type { ForwardRefExoticComponent, RefAttributes } from "react";
import {
  BarChart,
  CreditCard,
  Home,
  List,
  LucideProps,
  Wallet,
} from "lucide-react";

export type SidebarItemType = {
  title: string;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  url: string;
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
  { title: "Home", icon: Home, url: SidebarRouteUrl.HOME },
  {
    title: "Transactions",
    icon: CreditCard,
    url: SidebarRouteUrl.TRANSACTIONS,
  },
  {
    title: "Budgets",
    icon: Wallet,
    url: SidebarRouteUrl.BUDGET,
    disabled: true,
  },
  { title: "Reports", icon: BarChart, url: SidebarRouteUrl.REPORTS },
  { title: "Categories", icon: List, url: SidebarRouteUrl.CATEGORIES },
];
