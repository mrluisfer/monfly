import { DesktopNavMenu } from "./desktop-nav-menu";
import { HeaderActions } from "./header-actions";
import { HeaderLogo } from "./header-logo";

export function GlobalHeader() {
  return (
    <header className="sticky top-3 z-50 px-4 sm:px-6">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-3 rounded-2xl border border-white/70 bg-white/80 px-3 shadow-[0_14px_40px_-28px_rgba(15,23,42,0.45)] backdrop-blur-md dark:border-white/10 dark:bg-zinc-900/75 dark:shadow-[0_18px_48px_-30px_rgba(8,47,73,0.85)]">
        <div className="flex items-center">
          <HeaderLogo />
        </div>
        <DesktopNavMenu />
        <div className="flex items-center gap-2">
          <HeaderActions />
        </div>
      </div>
    </header>
  );
}
