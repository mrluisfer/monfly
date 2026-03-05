import { DesktopNavMenu } from "./desktop-nav-menu";
import { HeaderActions } from "./header-actions";
import { HeaderLogo } from "./header-logo";

export function GlobalHeader() {
  return (
    <header className="sticky top-2 z-50 px-3 pt-2 sm:top-3 sm:px-6 sm:pt-3">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 rounded-[1.25rem] border border-border/70 bg-background/78 px-2.5 shadow-[0_22px_36px_-30px_rgba(2,6,23,0.82)] backdrop-blur-md supports-backdrop-filter:bg-background/68 sm:px-3.5">
        <div className="flex items-center">
          <HeaderLogo />
        </div>
        <DesktopNavMenu />
        <div className="flex items-center gap-1.5 sm:gap-2">
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}
