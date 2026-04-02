import { useIsMobile } from "~/hooks/useMobile";

import UserDropdown from "../home/user-dropdown";
import { SettingsDialog } from "../settings/SettingsDialog";
import ToggleDarkMode from "../settings/ToggleDarkMode";
import { SpendingAlertBadge } from "./badges/SpendingAlertBadge";
import { SystemStatusBadge } from "./badges/SystemStatus";
import { TimezoneBadge } from "./badges/TimezoneBadge";
import { HeaderNavigation } from "./HeaderNavigation";
import { HideData } from "./HideData";
import { Logo } from "./Logo";
import { MobileHeaderSheetMenu } from "./MobileHeaderSheetMenu";

export const Header = () => {
  const isMobile = useIsMobile();

  const isDesktopBadgeActive = !isMobile;

  return (
    <header className="z-40 w-full">
      {/* Desktop Header */}
      <div className="app-panel hidden md:flex min-h-16 items-start lg:items-center justify-between md:py-3 px-3 sm:px-4 lg:px-5 rounded-4xl">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <Logo withTitle={false} />
          </div>
          <div className="hidden lg:block">
            <HeaderNavigation />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 md:gap-5 lg:gap-5 flex-wrap">
          <SpendingAlertBadge
            compact
            isActive={isDesktopBadgeActive}
            className="max-w-45"
            showIcon={false}
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
            showIcon={false}
          />

          <HideData />
          <ToggleDarkMode />
          <SettingsDialog />
          <UserDropdown />
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden w-full items-center justify-between rounded-2xl px-3 py-2.5">
        <nav className="w-fit" aria-label="Mobile navigation">
          <HeaderNavigation />
        </nav>
        <div className="flex items-center justify-end gap-3">
          <ToggleDarkMode />
          <SettingsDialog />
          <MobileHeaderSheetMenu />
        </div>
      </div>
    </header>
  );
};
