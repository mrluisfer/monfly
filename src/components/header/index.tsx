import { useIsMobile } from "~/hooks/useMobile";

import UserDropdown from "../home/user-dropdown";
import { SettingsDialog } from "../settings/SettingsDialog";
import ToggleDarkMode from "../settings/ToggleDarkMode";
import { SpendingAlertBadge } from "./badges/SpendingAlertBadge";
import { SystemStatusBadge } from "./badges/SystemStatus";
import { TimezoneBadge } from "./badges/TimezoneBadge";
import { HeaderNavigation } from "./HeaderNavigation";
import { Logo } from "./Logo";
import { MobileHeaderSheetMenu } from "./MobileHeaderSheetMenu";

export const Header = () => {
  const isMobile = useIsMobile();

  const isDesktopBadgeActive = !isMobile;

  return (
    <header className="z-40 w-full hidden md:block">
      <div className="app-panel flex min-h-16 items-start lg:items-center justify-between md:py-3 px-3 sm:px-4 lg:px-5 rounded-4xl">
        <div className="flex items-center gap-4">
          <div className="lg:hidden">
            <Logo withTitle={false} />
          </div>
          <div className="hidden lg:block">
            <HeaderNavigation />
          </div>
        </div>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center justify-end gap-2 md:gap-5 lg:gap-5 flex-wrap">
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

          <ToggleDarkMode />
          <SettingsDialog />
          <UserDropdown />
        </div>

        <MobileHeaderSheetMenu />
      </div>
    </header>
  );
};
