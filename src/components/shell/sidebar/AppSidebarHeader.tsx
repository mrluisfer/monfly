import { Link } from "@tanstack/react-router";
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import LogoSvg from "~/assets/logo.svg";

export function AppSidebarHeader() {
  return (
    <SidebarHeader className="border-sidebar-border/60 border-b">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            size="lg"
            className="group-data-[collapsible=icon]:!p-2 hover:bg-sidebar-accent/40 active:bg-sidebar-accent/40"
            tooltip="Monfly"
            render={<Link to="/home" />}
          >
            <img
              src={LogoSvg}
              alt=""
              aria-hidden="true"
              className="size-5"
              width={20}
              height={20}
            />
            <div className="grid flex-1 text-left leading-tight">
              <span className="truncate font-semibold text-sm tracking-tight">
                Monfly
              </span>
              <span className="truncate text-sidebar-foreground/60 text-xs">
                Personal finance
              </span>
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarHeader>
  );
}
