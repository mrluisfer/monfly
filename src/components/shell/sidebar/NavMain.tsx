import { Link, useLocation } from "@tanstack/react-router";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { sidebarRoutes } from "@/constants/sidebar-routes";
import { cn } from "@/lib/utils";
import { isRouteActive } from "./utils";

export function NavMain() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  const handleNavigate = () => {
    setOpenMobile(false);
  };

  return (
    <SidebarGroup>
      <SidebarGroupLabel>Workspace</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {sidebarRoutes.map((route) => {
            const active = isRouteActive(location.pathname, route.url);
            const Icon = route.icon;
            const disabled = Boolean(route.disabled);

            return (
              <SidebarMenuItem key={route.url}>
                <SidebarMenuButton
                  tooltip={
                    disabled ? `${route.title} (coming soon)` : route.title
                  }
                  isActive={active}
                  disabled={disabled}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
                    "transition-colors",
                  )}
                  render={
                    disabled ? (
                      <button type="button" disabled aria-disabled="true">
                        <Icon aria-hidden="true" />
                        <span>{route.title}</span>
                        <span className="ml-auto rounded-full border border-sidebar-border/60 px-1.5 py-0.5 font-medium text-[10px] text-sidebar-foreground/60 uppercase tracking-wide">
                          Soon
                        </span>
                      </button>
                    ) : (
                      <Link to={route.url} onClick={handleNavigate}>
                        <Icon aria-hidden="true" />
                        <span>{route.title}</span>
                      </Link>
                    )
                  }
                />
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
