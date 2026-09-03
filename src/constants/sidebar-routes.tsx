import {
  BarChart,
  Calculator,
  FolderTree,
  HandCoins,
  LayoutDashboard,
  type LucideProps,
  Receipt,
  WalletCards,
} from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

export interface SidebarItemType {
  disabled?: boolean;
  icon: ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
  >;
  title: string;
  url: string;
}

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
  { icon: LayoutDashboard, title: "Home", url: SidebarRouteUrl.HOME },
  {
    icon: Receipt,
    title: "Transactions",
    url: SidebarRouteUrl.TRANSACTIONS,
  },
  {
    icon: WalletCards,
    title: "Cards",
    url: SidebarRouteUrl.CARDS,
  },
  {
    disabled: false,
    icon: HandCoins,
    title: "Loans",
    url: SidebarRouteUrl.LOANS,
  },
  { icon: BarChart, title: "Reports", url: SidebarRouteUrl.REPORTS },
  { icon: FolderTree, title: "Categories", url: SidebarRouteUrl.CATEGORIES },
  {
    icon: Calculator,
    title: "Calculator",
    url: SidebarRouteUrl.CALCULATOR,
  },
];
