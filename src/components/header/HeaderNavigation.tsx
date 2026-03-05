import { Link, useLocation } from "@tanstack/react-router";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Logo } from "./Logo";

const breadcrumbList = [
  { title: "Home", url: "/" },
  { title: "Home", url: "/home" },
  { title: "Transactions", url: "/transactions" },
  { title: "Categories", url: "/categories" },
  { title: "Calculator", url: "/balance-calculator" },
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
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbLink render={<Logo />} />
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
