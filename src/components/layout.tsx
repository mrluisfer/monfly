import type { ReactNode } from "@tanstack/react-router";
import Header from "./header";
import Sidebar from "./sidebar";
import { SidebarProvider } from "./ui/sidebar";

const Layout = ({ children }: { children: ReactNode }) => {
	return (
		<SidebarProvider>
			<div className="grid grid-cols-[auto_1fr] h-screen w-full overflow-hidden">
				<Sidebar />
				<section className="p-4 flex flex-col gap-4">
					<Header />
					{children}
				</section>
			</div>
		</SidebarProvider>
	);
};

export default Layout;
