import { Link, useLocation } from "@tanstack/react-router";
import { PyramidIcon } from "lucide-react";
import { sidebarRoutes } from "~/constants/sidebar-routes";
import { SettingsDialog } from "../settings-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { SidebarTrigger } from "../ui/sidebar";

const Header = () => {
  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center gap-4">
        <SidebarTrigger />
        <HeaderNavigation />
      </div>
      <div className="flex items-center gap-4">
        <SettingsDialog />
      </div>
    </header>
  );
};

function HeaderNavigation() {
  const location = useLocation();

  const foundRouteTitle = sidebarRoutes.find(
    (route) => route.url === location.pathname,
  )?.title;
  const isHomeRoute = location.pathname === "/home";

  return (
    <Breadcrumb>
      <BreadcrumbList className="bg-background rounded-md border px-3 py-2 shadow-xs">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link to="/">
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

export default Header;
