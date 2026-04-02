import { type ReactNode } from "react";

import { Header } from "./header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="app-shell scrollbar-custom flex h-full min-h-dvh w-full flex-col gap-4 overflow-y-auto p-2 pb-5 md:p-4 lg:p-6">
      <div className="mx-auto flex w-full max-w-[96rem] flex-col gap-4">
        <Header />
        {children}
      </div>
    </main>
  );
};

export default Layout;
