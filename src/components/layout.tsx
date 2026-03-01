import { ReactNode } from "react";

import { Header } from "./header";
import { HeaderNavigation } from "./header/HeaderNavigation";
import { SettingsDialog } from "./settings/settings-dialog";
import ToggleDarkMode from "./settings/toggle-dark-mode";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="p-2 md:p-4 lg:p-8 flex flex-col gap-4 h-full w-full overflow-y-auto scrollbar-custom">
      <Header />
      <div className="w-full flex justify-between">
        <div className="w-fit">
          <HeaderNavigation />
        </div>
        <div className="flex items-center justify-end gap-4">
          <ToggleDarkMode />
          <SettingsDialog />
        </div>
      </div>
      {children}
    </main>
  );
};

export default Layout;
