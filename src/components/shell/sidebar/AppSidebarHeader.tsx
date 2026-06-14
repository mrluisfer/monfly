import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@tanstack/react-router";
import LogoSvg from "~/assets/logo.svg";

export function AppSidebarHeader() {
  return (
    <SidebarHeader className="border-sidebar-border/60 border-b">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="hover:bg-sidebar-accent/40 active:bg-sidebar-accent/40 group-data-[collapsible=icon]:!p-2"
            tooltip="Monfly"
            render={<Link to="/home" />}
          >
            <img src={LogoSvg} alt="" aria-hidden="true" className="size-5" />
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate text-sm font-semibold tracking-tight">
                Monfly
              </span>
              <span className="text-sidebar-foreground/60 truncate text-xs">
                Personal finance
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
