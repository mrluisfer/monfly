import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import LogoSvg from "~/assets/logo.svg";
import { SettingsDialog } from "~/components/settings/SettingsDialog";
import UserAvatar from "~/components/shared/UserAvatar";
import { SignOutDialog } from "~/components/sidebar/SignOutDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "~/components/ui/sidebar";
import { Skeleton } from "~/components/ui/skeleton";
import { sidebarRoutes } from "~/constants/sidebar-routes";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  SparklesIcon,
  UserIcon,
} from "lucide-react";

function isRouteActive(currentPath: string, url: string) {
  if (url === "/home") return currentPath === "/home";
  return currentPath === url || currentPath.startsWith(`${url}/`);
}

function AppSidebarHeader() {
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

function NavMain() {
  const location = useLocation();

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
                    "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium",
                    "transition-colors"
                  )}
                  render={
                    disabled ? (
                      <button type="button" disabled aria-disabled="true">
                        <Icon aria-hidden="true" />
                        <span>{route.title}</span>
                        <span className="ml-auto rounded-full border border-sidebar-border/60 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-sidebar-foreground/60">
                          Soon
                        </span>
                      </button>
                    ) : (
                      <Link to={route.url}>
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

function NavSecondary() {
  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          <SidebarMenuItem>
            <SettingsDialog>
              <SidebarMenuButton tooltip="Settings">
                <SettingsIcon aria-hidden="true" />
                <span>Settings</span>
              </SidebarMenuButton>
            </SettingsDialog>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton tooltip="What's new" disabled>
              <SparklesIcon aria-hidden="true" />
              <span>What&apos;s new</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function NavUser() {
  const userEmail = useRouteUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [activeDialog, setActiveDialog] = useState<
    "settings" | "sign-out" | null
  >(null);
  const pendingActionRef = useRef<"settings" | "sign-out" | null>(null);

  const { data, isPending } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  useEffect(() => {
    if (dropdownOpen || !pendingActionRef.current) return;
    const timer = window.setTimeout(() => {
      setActiveDialog(pendingActionRef.current);
      pendingActionRef.current = null;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [dropdownOpen]);

  const queueAction = (action: "settings" | "sign-out") => {
    pendingActionRef.current = action;
    setDropdownOpen(false);
  };

  const user = data?.data;
  const name = user?.name ?? "Guest";
  const email = user?.email ?? userEmail ?? "";

  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton size="lg">
            <Skeleton className="size-8 rounded-full" />
            <div className="flex-1 space-y-1">
              <Skeleton className="h-3 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  return (
    <>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
            <DropdownMenuTrigger
              render={
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                />
              }
            >
              <UserAvatar alt={name} name={name} />
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate text-sm font-medium">{name}</span>
                <span className="text-sidebar-foreground/60 truncate text-xs">
                  {email}
                </span>
              </div>
              <ChevronsUpDownIcon
                aria-hidden="true"
                className="ml-auto size-4 opacity-60"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="right"
              align="end"
              sideOffset={8}
              className="min-w-56"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center gap-2 p-2">
                  <UserAvatar alt={name} name={name} />
                  <div className="grid leading-tight">
                    <span className="truncate text-sm font-medium">{name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {email}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {user?.id && (
                  <DropdownMenuItem
                    render={
                      <Link to="/user/$userId" params={{ userId: user.id }} />
                    }
                  >
                    <UserIcon />
                    Profile
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => queueAction("settings")}>
                  <SettingsIcon />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => queueAction("sign-out")}
                className="text-destructive focus:text-destructive"
              >
                <LogOutIcon />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SettingsDialog
        open={activeDialog === "settings"}
        onOpenChange={(open) => {
          if (!open) setActiveDialog(null);
        }}
        showTrigger={false}
      />

      <SignOutDialog
        open={activeDialog === "sign-out"}
        onOpenChange={(open) => {
          if (!open) setActiveDialog(null);
        }}
      />
    </>
  );
}

export function AppSidebar() {
  return (
    <Sidebar collapsible="icon" variant="inset">
      <AppSidebarHeader />
      <SidebarContent className="gap-0">
        <NavMain />
        <NavSecondary />
      </SidebarContent>
      <SidebarFooter className="border-sidebar-border/60 border-t">
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
