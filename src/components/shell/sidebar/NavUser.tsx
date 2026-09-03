import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  ChevronsUpDownIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
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
import { SETTINGS_PATH } from "./sidebar-constants";

export function NavUser() {
  const userEmail = useRouteUser();
  const { isMobile, state, setOpenMobile } = useSidebar();
  // A collapsed rail has no room beside it, so the menu flies out to the right.
  const menuSide = !isMobile && state === "collapsed" ? "right" : "top";
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signOutOpen, setSignOutOpen] = useState(false);
  const pendingSignOutRef = useRef(false);

  const { data, isPending } = useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 10,
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    queryKey: [queryDictionary.user, userEmail],
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (dropdownOpen || !pendingSignOutRef.current) {
      return;
    }
    const timer = window.setTimeout(() => {
      setSignOutOpen(true);
      pendingSignOutRef.current = false;
    }, 0);
    return () => window.clearTimeout(timer);
  }, [dropdownOpen]);

  const queueSignOut = useCallback(() => {
    pendingSignOutRef.current = true;
    setDropdownOpen(false);
  }, []);

  const handleNavigate = useCallback(() => {
    setDropdownOpen(false);
    setOpenMobile(false);
  }, [setOpenMobile]);

  const user = data?.data;
  const name = user?.name ?? "Guest";
  const email = user?.email ?? userEmail ?? "";
  // Mirror the saved avatar seed so reshuffling on the profile also updates the
  // sidebar avatar (it previously always fell back to the name-derived one).
  const seed = user?.avatarSeed ?? undefined;

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
              <UserAvatar alt={name} name={name} seed={seed} />
              <div className="grid flex-1 text-left leading-tight">
                <span className="truncate font-medium text-sm">{name}</span>
                <span className="truncate text-sidebar-foreground/60 text-xs">
                  {email}
                </span>
              </div>
              <ChevronsUpDownIcon
                aria-hidden="true"
                className="ml-auto size-4 opacity-60"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side={menuSide}
              align="end"
              sideOffset={8}
              className="w-[14rem] min-w-56 max-w-[calc(100vw-1rem)]"
            >
              <DropdownMenuGroup>
                <DropdownMenuLabel className="flex items-center gap-2 p-2">
                  <UserAvatar alt={name} name={name} seed={seed} />
                  <div className="grid leading-tight">
                    <span className="truncate font-medium text-sm">{name}</span>
                    <span className="truncate text-muted-foreground text-xs">
                      {email}
                    </span>
                  </div>
                </DropdownMenuLabel>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {user?.id ? (
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
                ) : null}
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

      <SignOutDialog open={signOutOpen} onOpenChange={setSignOutOpen} />
    </>
  );
}
