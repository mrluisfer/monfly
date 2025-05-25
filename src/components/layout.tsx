import type { ReactNode } from "@tanstack/react-router";
import Sidebar from "./sidebar";
import { SidebarProvider } from "./ui/sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<SidebarProvider>
			<div className="grid grid-cols-[auto_1fr] h-screen w-full overflow-hidden">
				<Sidebar />
				<section className="p-4 bg-neutral-200">{children}</section>
			</div>
		</SidebarProvider>
	);
};

export default Layout;
