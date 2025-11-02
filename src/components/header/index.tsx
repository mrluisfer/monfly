import { Link } from "@tanstack/react-router";

import Logo from "../../assets/logo.svg";
import UserDropdown from "../home/user-dropdown";
import { SettingsDialog } from "../settings/settings-dialog";
import ToggleDarkMode from "../settings/toggle-dark-mode";
import { OnlineStatusBadge } from "./badges/online-status-badge";
import { SpendingAlertBadge } from "./badges/spending-alert-badge";
import { SystemStatusBadge } from "./badges/system-status";
import { TimezoneBadge } from "./badges/timezone-badge";
import { HeaderNavigation } from "./HeaderNavigation";

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
        <ToggleDarkMode />
        <SettingsDialog />
        <UserDropdown />
      </div>
    </header>
  );
};
