import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import LogoSvg from "~/assets/logo.svg";
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
  useSidebar,
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
  UserIcon,
} from "lucide-react";

const SETTINGS_PATH = "/user/settings";

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
                    "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium",
                    "transition-colors",
                  )}
                  render={
                    disabled ? (
                      <button type="button" disabled aria-disabled="true">
                        <Icon aria-hidden="true" />
                        <span>{route.title}</span>
                        <span className="border-sidebar-border/60 text-sidebar-foreground/60 ml-auto rounded-full border px-1.5 py-0.5 text-[10px] font-medium tracking-wide uppercase">
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

function NavSecondary() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const userEmail = useRouteUser();
  const active = isRouteActive(location.pathname, SETTINGS_PATH);

  const { data } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  const userId = data?.data?.id;

  return (
    <SidebarGroup className="mt-auto">
      <SidebarGroupContent>
        <SidebarMenu>
          {userId && (
            <SidebarMenuItem>
              <SidebarMenuButton
                render={
                  <Link
                    to="/user/$userId"
                    params={{ userId }}
                    onClick={() => setOpenMobile(false)}
                  />
                }
              >
                <UserIcon />
                Profile
              </SidebarMenuButton>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton
              tooltip="Settings"
              isActive={active}
              aria-current={active ? "page" : undefined}
              className={cn(
                "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium",
                "transition-colors",
              )}
              render={
                <Link to={SETTINGS_PATH} onClick={() => setOpenMobile(false)}>
                  <SettingsIcon aria-hidden="true" />
                  <span>Settings</span>
                </Link>
              }
            />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function NavUser() {
  const userEmail = useRouteUser();
  const { isMobile, state, setOpenMobile } = useSidebar();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const pendingSignOutRef = useRef(false);

  const { data, isPending } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  useEffect(() => {
    if (dropdownOpen || !pendingSignOutRef.current) return;
    const timer = window.setTimeout(() => {
      setSignOutOpen(true);
      pendingSignOutRef.current = false;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [dropdownOpen]);

  const queueSignOut = () => {
    pendingSignOutRef.current = true;
    setDropdownOpen(false);
  };

  const handleNavigate = () => {
    setDropdownOpen(false);
    setOpenMobile(false);
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
              side={isMobile ? "top" : state === "collapsed" ? "right" : "top"}
              align="end"
              sideOffset={8}
              className="w-[14rem] max-w-[calc(100vw-1rem)] min-w-56"
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
                      <Link
                        to="/user/$userId"
                        params={{ userId: user.id }}
                        onClick={handleNavigate}
                      />
                    }
                  >
                    <UserIcon />
                    Profile
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem
                  render={<Link to={SETTINGS_PATH} onClick={handleNavigate} />}
                >
                  <SettingsIcon />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={queueSignOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOutIcon />
                Sign out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>

      <SignOutDialog
        open={signOutOpen}
        onOpenChange={(open) => {
          if (!open) setSignOutOpen(false);
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
