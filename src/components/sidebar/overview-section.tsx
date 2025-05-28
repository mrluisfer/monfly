// ! DEPRECATED

import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "@radix-ui/react-collapsible";
import { Link } from "@tanstack/react-router";
import clsx from "clsx";
import { ChevronRight } from "lucide-react";
import { useState } from "react";
import {
	SidebarGroup,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "../ui/sidebar";

export const overviewSections = {
	balance: "balance",
};

const OverviewSection = ({
	currentPath,
	fullPath,
}: { currentPath: string; fullPath: string }) => {
	const [isOpen, setIsOpen] = useState(false);

	const overviewSectionValues = Object.values(overviewSections);

	return (
		<SidebarGroup>
			<SidebarMenu>
				<Collapsible
					open={isOpen}
					onOpenChange={setIsOpen}
					className="group/collapsible"
				>
					<SidebarMenuItem>
						<CollapsibleTrigger asChild>
							<SidebarMenuButton isActive={isOpen || currentPath === "/home"}>
								<span>Overview</span>
								<ChevronRight
									className={clsx(
										"ml-auto group-[.open/collapsible]:rotate-180 transition-transform",
										isOpen && "rotate-90",
									)}
								/>
							</SidebarMenuButton>
						</CollapsibleTrigger>
						<CollapsibleContent>
							<SidebarMenuSub>
								{overviewSectionValues.map((section) => (
									<SidebarMenuSubItem key={section}>
										<SidebarMenuSubButton
											isActive={
												fullPath === `/home#${section}` ||
												fullPath === `/home/${section}`
											}
											asChild
											className="capitalize"
										>
											<a href={`#${section}`}>{section}</a>
										</SidebarMenuSubButton>
									</SidebarMenuSubItem>
								))}
							</SidebarMenuSub>
						</CollapsibleContent>
					</SidebarMenuItem>
				</Collapsible>
			</SidebarMenu>
		</SidebarGroup>
	);
};

export default OverviewSection;
