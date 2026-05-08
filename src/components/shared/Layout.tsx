import { type ReactNode } from "react";
import { useAtom } from "jotai";

import {
  sidebarOpenAtom,
  sidebarOpenMobileAtom,
} from "~/state/atoms/ui/sidebarAtoms";
import { AppSidebar } from "../shell/AppSidebar";
import { CommandPaletteProvider } from "../shell/CommandPalette";
import { Topbar } from "../shell/Topbar";
import { SidebarInset, SidebarProvider } from "../ui/sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useAtom(sidebarOpenAtom);
  const [openMobile, setOpenMobile] = useAtom(sidebarOpenMobileAtom);

  return (
    <SidebarProvider
      open={open}
      onOpenChange={setOpen}
      openMobile={openMobile}
      onOpenMobileChange={setOpenMobile}
    >
      <CommandPaletteProvider>
        <a
          href="#main-content"
          className="bg-primary text-primary-foreground sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:rounded-lg focus:px-3 focus:py-2 focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
        >
          Skip to content
        </a>
        <AppSidebar />
        <SidebarInset className="bg-background min-h-dvh">
          <Topbar />
          <main
            id="main-content"
            tabIndex={-1}
            className="scrollbar-custom flex flex-1 flex-col gap-6 overflow-y-auto p-4 pb-10 outline-none md:p-6 lg:p-8"
          >
            <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-6">
              {children}
            </div>
          </main>
        </SidebarInset>
      </CommandPaletteProvider>
    </SidebarProvider>
  );
};

export default Layout;
