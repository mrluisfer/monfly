import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { queryDictionary } from "~/queries/dictionary";
import { PyramidIcon, User2 } from "lucide-react";

import Logo from "../../assets/logo.svg";
import { SettingsDialog } from "../settings/settings-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Button } from "../ui/button";
import { Skeleton } from "../ui/skeleton";
import UserAvatar from "../user-avatar";
import { OnlineStatusBadge } from "./badges/online-status-badge";
import { SpendingAlertBadge } from "./badges/spending-alert-badge";
import { SystemStatusBadge } from "./badges/system-status";
import { TimezoneBadge } from "./badges/timezone-badge";

export const Header = () => {
  const userEmail = useRouteUser();

  const { data, isPending, error } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  return (
    <header className="flex justify-between items-center">
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
        <Link
          title="Profile"
          to={`/user/$userId`}
          params={{ userId: data?.data?.id ?? "" }}
          disabled={!data?.data?.id}
          className="flex items-center gap-1"
        >
          {isPending ? (
            <>
              <User2 /> <Skeleton className="w-18 h-4" />
            </>
          ) : (
            <Button variant="outline" size={"icon"} className="rounded-full">
              <UserAvatar
                alt={data?.data?.name ?? ""}
                name={data?.data?.name ?? ""}
              />
              <span className="sr-only">{data?.data?.name}</span>
            </Button>
          )}
        </Link>
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
