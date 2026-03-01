import { Link, useLocation } from "@tanstack/react-router";
import { LogOutIcon, MenuIcon } from "lucide-react";
import { useState } from "react";
import { sidebarRoutes } from "~/constants/sidebar-routes";
import { useIsMobile } from "~/hooks/use-mobile";

import Logo from "../../assets/logo.svg";
import UserDropdown from "../home/user-dropdown";
import { SettingsDialog } from "../settings/settings-dialog";
import ToggleDarkMode from "../settings/toggle-dark-mode";
import { SignOutDialog } from "../sidebar/sign-out-dialog";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { OnlineStatusBadge } from "./badges/online-status-badge";
import { SpendingAlertBadge } from "./badges/spending-alert-badge";
import { SystemStatusBadge } from "./badges/system-status";
import { TimezoneBadge } from "./badges/timezone-badge";
import { HeaderNavigation } from "./HeaderNavigation";

export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const isDesktopBadgeActive = !isMobile;
  const isMobileBadgeActive = isMobile && isOpen;

  const mobileNavigationRoutes = sidebarRoutes.filter(
    (route, index, routes) =>
      routes.findIndex((item) => item.url === route.url) === index
  );

  const isActiveRoute = (routeUrl: string) =>
    location.pathname === routeUrl ||
    (routeUrl !== "/home" && location.pathname.startsWith(`${routeUrl}/`));

  return (
    <header className="sticky top-0 z-40 w-full bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-4">
          <Link
            to="/home"
            className="flex items-center gap-2 text-xl md:text-2xl font-bold w-fit me-2 md:me-4"
          >
            <img
              src={Logo}
              alt="Monfly Logo"
              className="h-6 w-6 md:h-8 md:w-8"
              title="Monfly"
            />
            <span className="sidebar-title-text hidden md:block">Monfly</span>
          </Link>
          <div className="hidden lg:block">
            <HeaderNavigation />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center justify-end gap-2 lg:gap-2.5 flex-wrap">
          <SpendingAlertBadge
            compact
            isActive={isDesktopBadgeActive}
            className="max-w-45"
          />
          <OnlineStatusBadge
            compact
            variant="outline"
            isActive={isDesktopBadgeActive}
            className="max-w-30"
          />
          <TimezoneBadge
            compact
            variant="outline"
            showTimezone={false}
            isActive={isDesktopBadgeActive}
            className="max-w-30"
          />
          <SystemStatusBadge
            compact
            variant="outline"
            isActive={isDesktopBadgeActive}
            className="max-w-37.5"
          />
          <UserDropdown />
        </div>

        {/* Mobile Menu Trigger */}
        <div className="flex md:hidden items-center gap-2">
          <UserDropdown />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger
              render={
                <Button variant="ghost" size="icon" className="shrink-0">
                  <MenuIcon className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              }
            />
            <SheetContent
              side="right"
              className="h-dvh w-[92vw] max-w-100 gap-0 overflow-hidden p-0"
            >
              <div className="flex h-full min-h-0 flex-col">
                <SheetHeader className="border-b px-6 py-4 text-left">
                  <SheetTitle className="flex items-center gap-2 pr-10">
                    <img src={Logo} alt="Monfly" className="h-6 w-6" />
                    Monfly
                  </SheetTitle>
                </SheetHeader>
                <div className="scrollbar-custom flex-1 min-h-0 overflow-y-auto px-6 py-5 pb-6">
                  <div className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Navigation
                      </h3>
                      <nav className="flex flex-col gap-2">
                        {mobileNavigationRoutes.map((route) => {
                          const isDisabled = Boolean(route.disabled);
                          const isActive = isActiveRoute(route.url);
                          const itemClassName = `flex items-center gap-2 rounded-md p-2 transition-colors ${
                            isDisabled
                              ? "cursor-not-allowed opacity-50"
                              : isActive
                                ? "bg-muted text-foreground"
                                : "hover:bg-muted"
                          }`;

                          if (isDisabled) {
                            return (
                              <div
                                key={route.url}
                                className={itemClassName}
                                aria-disabled="true"
                              >
                                <route.icon className="h-5 w-5" />
                                <span className="font-medium">
                                  {route.title}
                                </span>
                              </div>
                            );
                          }

                          return (
                            <Link
                              key={route.url}
                              to={route.url}
                              className={itemClassName}
                              onClick={() => setIsOpen(false)}
                            >
                              <route.icon className="h-5 w-5" />
                              <span className="font-medium">{route.title}</span>
                            </Link>
                          );
                        })}
                      </nav>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        System Status
                      </h3>
                      <div className="flex w-full flex-col items-stretch gap-2.5">
                        <OnlineStatusBadge
                          fullWidth
                          variant="outline"
                          isActive={isMobileBadgeActive}
                          className="h-10 rounded-xl"
                        />
                        <SystemStatusBadge
                          fullWidth
                          variant="outline"
                          isActive={isMobileBadgeActive}
                          className="h-10 rounded-xl"
                        />
                        <TimezoneBadge
                          fullWidth
                          variant="outline"
                          isActive={isMobileBadgeActive}
                          className="h-10 rounded-xl"
                        />
                        <SpendingAlertBadge
                          fullWidth
                          showPercentage
                          isActive={isMobileBadgeActive}
                          className="h-10 rounded-xl"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Preferences
                      </h3>
                      <div className="flex items-center justify-between">
                        <span>Dark Mode</span>
                        <ToggleDarkMode size="icon-lg" />
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Settings</span>
                        <SettingsDialog />
                      </div>
                    </div>

                    <div className="flex flex-col gap-4">
                      <h3 className="text-sm font-medium text-muted-foreground">
                        Account
                      </h3>
                      <div className="flex items-center justify-between">
                        <span>Log Out</span>
                        <SignOutDialog>
                          <Button
                            variant="destructive"
                            size="icon-lg"
                            className="shrink-0"
                            aria-label="Log out"
                          >
                            <LogOutIcon className="size-4" />
                          </Button>
                        </SignOutDialog>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
