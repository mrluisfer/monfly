import { ReactNode } from "react";

import { Header } from "./header";
import { HeaderNavigation } from "./header/HeaderNavigation";
import { MobileHeaderSheetMenu } from "./header/MobileHeaderSheetMenu";
import { SettingsDialog } from "./settings/SettingsDialog";
import ToggleDarkMode from "./settings/ToggleDarkMode";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="app-shell scrollbar-custom flex h-full min-h-dvh w-full flex-col gap-4 overflow-y-auto p-2 pb-5 md:p-4 lg:p-6">
      <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-4">
        <Header />
        <div className="app-panel md:hidden flex w-full items-center justify-between rounded-2xl px-3 py-2.5">
          <div className="w-fit lg:hidden">
            <HeaderNavigation />
          </div>
          <div className="flex items-center justify-end gap-3 lg:flex-1">
            <ToggleDarkMode size={"icon-lg"} />
            <SettingsDialog />
            <MobileHeaderSheetMenu />
          </div>
        </div>
        {children}
      </div>
    </main>
  );
};

export default Layout;
