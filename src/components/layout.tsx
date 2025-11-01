import { ReactNode } from "react";

import { Header } from "./header";
import { SidebarProvider } from "./ui/sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      {/* <Sidebar /> */}
      <main className="p-4 lg:p-8 flex flex-col gap-4 h-full w-full overflow-y-auto scrollbar-custom">
        <Header />
        {children}
      </main>
    </SidebarProvider>
  );
};

export default Layout;
