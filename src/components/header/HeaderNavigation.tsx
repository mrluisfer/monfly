import { Link, useLocation } from "@tanstack/react-router";
import { PyramidIcon } from "lucide-react";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";

const breadcrumbList = [
  { title: "Home", url: "/" },
  { title: "Home", url: "/home" },
  { title: "Transactions", url: "/transactions" },
  { title: "Categories", url: "/categories" },
  { title: "Balance Lab", url: "/balance-calculator" },
  { title: "Budgets", url: "/budgets" },
  { title: "Reports", url: "/reports" },
  { title: "User", url: "/user/$userId" },
];

export function HeaderNavigation() {
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
          <BreadcrumbLink
            render={
              <Link to="/home" className="text-primary">
                <PyramidIcon size={16} aria-hidden="true" />
                <span className="sr-only">Home</span>
              </Link>
            }
          />
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <BreadcrumbLink
            render={
              <Link to="/home">{isHomeRoute ? foundRouteTitle : "Home"}</Link>
            }
          />
        </BreadcrumbItem>
        {!isHomeRoute && (
          <>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink
                render={<Link to={location.pathname}>{foundRouteTitle}</Link>}
              />
            </BreadcrumbItem>
          </>
        )}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
