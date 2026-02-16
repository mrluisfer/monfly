import { Link } from "@tanstack/react-router";
import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { sidebarRoutes } from "~/constants/sidebar-routes";

import Logo from "../../assets/logo.svg";
import UserDropdown from "../home/user-dropdown";
import { SettingsDialog } from "../settings/settings-dialog";
import ToggleDarkMode from "../settings/toggle-dark-mode";
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

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
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
        <div className="hidden md:block">
          <HeaderNavigation />
        </div>
      </div>

      {/* Desktop Actions */}
      <div className="hidden md:flex justify-end items-center gap-4 flex-wrap">
        <SpendingAlertBadge />
        <OnlineStatusBadge />
        <TimezoneBadge />
        <SystemStatusBadge />
        <div className="flex items-center gap-4 w-px h-6 bg-border mx-2" />
        <ToggleDarkMode />
        <SettingsDialog />
        <UserDropdown />
      </div>

      {/* Mobile Menu Trigger */}
      <div className="flex md:hidden items-center gap-2">
        <UserDropdown />
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="shrink-0">
              <MenuIcon className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px] sm:w-[400px] p-6">
            <SheetHeader className="text-left mb-6">
              <SheetTitle className="flex items-center gap-2">
                <img src={Logo} alt="Monfly" className="h-6 w-6" />
                Monfly
              </SheetTitle>
            </SheetHeader>
            <div className="flex flex-col gap-6">
              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Navigation
                </h3>
                <nav className="flex flex-col gap-2">
                  <Link
                    to="/home"
                    className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    <span className="font-medium">Home</span>
                  </Link>
                  {sidebarRoutes.map((route) => (
                    <Link
                      key={route.url}
                      to={route.url}
                      className="flex items-center gap-2 p-2 rounded-md hover:bg-muted transition-colors"
                      onClick={() => setIsOpen(false)}
                    >
                      <route.icon className="h-5 w-5" />
                      <span className="font-medium">{route.title}</span>
                    </Link>
                  ))}
                </nav>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  System Status
                </h3>
                <div className="flex flex-col gap-3 items-start">
                  <OnlineStatusBadge />
                  <SystemStatusBadge />
                  <TimezoneBadge />
                  <SpendingAlertBadge />
                </div>
              </div>

              <div className="flex flex-col gap-4">
                <h3 className="text-sm font-medium text-muted-foreground">
                  Preferences
                </h3>
                <div className="flex items-center justify-between">
                  <span>Dark Mode</span>
                  <ToggleDarkMode />
                </div>
                <div className="flex items-center justify-between">
                  <span>Settings</span>
                  <SettingsDialog />
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
