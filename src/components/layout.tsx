import { ReactNode } from "react";

import { Header } from "./header";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <main className="p-2 md:p-4 lg:p-8 flex flex-col gap-4 h-full w-full overflow-y-auto scrollbar-custom">
      <Header />
      {children}
    </main>
  );
};

export default Layout;
