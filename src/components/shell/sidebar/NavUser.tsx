import { UserAvatar } from "@/components/shared";
import { SignOutDialog } from "@/components/sidebar/SignOutDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { useRouteUser } from "@/hooks";
import { getUserByEmailServer } from "@/lib/api/user/get-user-by-email";
import { queryDictionary } from "@/queries/dictionary";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { SETTINGS_PATH } from "./sidebar-constants";

export function NavUser() {
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
