import { useState } from "react";
import { Link, useLocation } from "@tanstack/react-router";
import { sidebarRoutes } from "~/constants/sidebar-routes";
import { useIsMobile } from "~/hooks/useMobile";
import { LogOutIcon, MenuIcon } from "lucide-react";

import UserDropdown from "../home/user-dropdown";
import { SettingsDialog } from "../settings/SettingsDialog";
import ToggleDarkMode from "../settings/ToggleDarkMode";
import { SignOutDialog } from "../sidebar/SignOutDialog";
import { Button } from "../ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";
import { OnlineStatusBadge } from "./badges/OnlineStatusBadge";
import { SpendingAlertBadge } from "./badges/SpendingAlertBadge";
import { SystemStatusBadge } from "./badges/SystemStatus";
import { TimezoneBadge } from "./badges/TimezoneBadge";
import { Logo } from "./Logo";

export function MobileHeaderSheetMenu() {
  const [isOpen, setIsOpen] = useState(false);
  const isMobile = useIsMobile();
  const location = useLocation();

  const isMobileBadgeActive = isMobile && isOpen;

  const mobileNavigationRoutes = sidebarRoutes.filter(
    (route, index, routes) =>
      routes.findIndex((item) => item.url === route.url) === index
  );

  const isActiveRoute = (routeUrl: string) =>
    location.pathname === routeUrl ||
    (routeUrl !== "/home" && location.pathname.startsWith(`${routeUrl}/`));

  return (
    <div className="flex md:hidden items-center gap-2">
      <UserDropdown />
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger
          render={
            <Button variant="ghost" size="icon-lg" className="shrink-0">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          }
        />
        <SheetContent
          side="right"
          className="h-dvh w-[92vw] max-w-100 gap-0 overflow-hidden border-border/70 bg-background/95 p-0 backdrop-blur-sm"
        >
          <div className="flex h-full min-h-0 flex-col">
            <SheetHeader className="border-b px-6 py-4 text-left">
              <SheetTitle className="flex items-center gap-2 pr-10">
                <Logo />
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
                            <span className="font-medium">{route.title}</span>
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
  );
}
