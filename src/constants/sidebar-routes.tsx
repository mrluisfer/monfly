import type { ForwardRefExoticComponent, RefAttributes } from "react";
import {
  BarChart,
  Calculator,
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
  TRANSACTIONS = "/home/transactions",
  LOANS = "/home/loans",
  REPORTS = "/home/reports",
  CATEGORIES = "/home/categories",
  CALCULATOR = "/home/balance-calculator",
}

export const sidebarRoutes: SidebarItemType[] = [
  { title: "Home", icon: Home, url: SidebarRouteUrl.HOME },
  {
    title: "Transactions",
    icon: CreditCard,
    url: SidebarRouteUrl.TRANSACTIONS,
  },
  {
    title: "Loans",
    icon: Wallet,
    url: SidebarRouteUrl.LOANS,
    disabled: false,
  },
  { title: "Reports", icon: BarChart, url: SidebarRouteUrl.REPORTS },
  { title: "Categories", icon: List, url: SidebarRouteUrl.CATEGORIES },
  {
    title: "Calculator",
    icon: Calculator,
    url: SidebarRouteUrl.CALCULATOR,
  },
];
