import {
  BarChart,
  Calculator,
  FolderTree,
  HandCoins,
  LayoutDashboard,
  LucideProps,
  Receipt,
  WalletCards,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

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
  CARDS = "/home/cards",
  LOANS = "/home/loans",
  REPORTS = "/home/reports",
  CATEGORIES = "/home/categories",
  CALCULATOR = "/home/balance-calculator",
}

export const sidebarRoutes: SidebarItemType[] = [
  { title: "Home", icon: LayoutDashboard, url: SidebarRouteUrl.HOME },
  {
    title: "Transactions",
    icon: Receipt,
    url: SidebarRouteUrl.TRANSACTIONS,
  },
  {
    title: "Cards",
    icon: WalletCards,
    url: SidebarRouteUrl.CARDS,
  },
  {
    title: "Loans",
    icon: HandCoins,
    url: SidebarRouteUrl.LOANS,
    disabled: false,
  },
  { title: "Reports", icon: BarChart, url: SidebarRouteUrl.REPORTS },
  { title: "Categories", icon: FolderTree, url: SidebarRouteUrl.CATEGORIES },
  {
    title: "Calculator",
    icon: Calculator,
    url: SidebarRouteUrl.CALCULATOR,
  },
];
