import type { ReactNode } from "@tanstack/react-router";
import Header from "./header";
import Sidebar from "./sidebar";
import { SidebarProvider } from "./ui/sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<SidebarProvider>
			<Sidebar />
			<main className="p-4 flex flex-col gap-4 h-full w-full overflow-y-auto scrollbar-custom">
				<Header />
				{children}
			</main>
		</SidebarProvider>
	);
};

export default Layout;
