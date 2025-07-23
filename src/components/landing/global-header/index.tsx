// components/layout/global-header.tsx

import { DesktopNavMenu } from "./desktop-nav-menu";
import { HeaderActions } from "./header-actions";
import { HeaderLogo } from "./header-logo";
import { MobileMenuPopover } from "./mobile-menu-popover";

export function GlobalHeader() {
  return (
    <header className="border-b px-4 md:px-6">
      <div className="flex h-16 items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <MobileMenuPopover />
          <div className="flex items-center gap-6">
            <HeaderLogo />
          </div>
        </div>
        <DesktopNavMenu />
        <HeaderActions />
      </div>
    </header>
  );
}
