import { Link, useLocation } from "@tanstack/react-router";
import { PyramidIcon } from "lucide-react";

import Logo from "../../assets/logo.svg";
import UserDropdown from "../home/user-dropdown";
import { SettingsDialog } from "../settings/settings-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { OnlineStatusBadge } from "./badges/online-status-badge";
import { SpendingAlertBadge } from "./badges/spending-alert-badge";
import { SystemStatusBadge } from "./badges/system-status";
import { TimezoneBadge } from "./badges/timezone-badge";

export const Header = () => {
  return (
    <header className="flex justify-between items-center gap-6">
      <div className="flex items-center gap-4">
        <Link
          to="/home"
          href="/home"
          className="flex items-center gap-2 text-2xl font-bold w-fit me-4"
        >
          <img
            src={Logo}
            alt="Monfly Logo"
            className="h-8 w-8"
            title="Monfly"
          />
          <span className="sidebar-title-text hidden 3xl:block">Monfly</span>
        </Link>
        <HeaderNavigation />
      </div>
      <div className="flex justify-end items-center gap-4 flex-wrap">
        <SpendingAlertBadge />
        <OnlineStatusBadge />
        <TimezoneBadge />
        <SystemStatusBadge />
      </div>
      <div className="flex items-center gap-4">
        <SettingsDialog />
        <UserDropdown />
      </div>
    </header>
  );
};

const breadcrumbList = [
  { title: "Home", url: "/" },
  { title: "Home", url: "/home" },
  { title: "Transactions", url: "/transactions" },
  { title: "Categories", url: "/categories" },
  { title: "Budgets", url: "/budgets" },
  { title: "Reports", url: "/reports" },
  { title: "User", url: "/user/$userId" },
];

function HeaderNavigation() {
  const location = useLocation();

  const foundRouteTitle = breadcrumbList.find((route) => {
    const currentPathname = location.pathname.split("/")[1];
    const routePathname = route.url.split("/")[1];
    return currentPathname === routePathname || route.url === location.pathname;
  })?.title;

  const isHomeRoute = location.pathname === "/home";

  return (
    <Breadcrumb>
      <BreadcrumbList className="bg-background rounded-md border px-3 py-2 shadow-xs">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/" className="text-primary">
              <PyramidIcon size={16} aria-hidden="true" />
              <span className="sr-only">Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/home">{isHomeRoute ? foundRouteTitle : "Home"}</Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {!isHomeRoute && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link to={location.pathname}>{foundRouteTitle}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
