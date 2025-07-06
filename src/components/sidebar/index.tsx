import { useQuery } from "@tanstack/react-query";
import { Link, useLocation, useNavigate } from "@tanstack/react-router";
import { sidebarRoutes } from "~/constants/sidebar-routes";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { queryDictionary } from "~/queries/dictionary";
import { logoutFn } from "~/utils/auth/logoutfn";
import { BadgeHelp, BrainCircuit, LogOut, Settings, User2 } from "lucide-react";

import { SettingsDialog } from "../settings-dialog";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  Sidebar as UiSidebar,
  useSidebar,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import UserAvatar from "../user-avatar";

const Sidebar = () => {
  const location = useLocation();
  const currentPath = location.pathname;
  const navigate = useNavigate();
  const userEmail = useRouteUser();
  const { open } = useSidebar();

  const { data, isPending, error } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
  });

  const handleLogOut = async () => {
    await logoutFn({
      data: { destination: "/login", manualRedirect: true },
    });
    await navigate({
      to: "/login",
    });
  };

  return (
    <UiSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            {open && (
              <Link
                to="/home"
                href="/home"
                className="flex items-center gap-2 text-2xl font-bold w-fit"
              >
                <BrainCircuit />
                Finance
              </Link>
            )}
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="text-sm font-medium">Main menu</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {sidebarRoutes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    tooltip={item.title}
                    asChild
                    isActive={currentPath === item.url}
                    disabled={item?.disabled}
                    className="capitalize"
                    title={item.disabled ? "Coming soon" : item.title}
                  >
                    <Link to={item.url} href={item.url}>
                      {item.icon} {item.title}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>
            <span className="text-sm font-medium">User menu</span>
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild disabled>
                  <Link to="/help" href="/help" title="Coming soon">
                    <BadgeHelp />
                    <span>Help</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SettingsDialog>
                  <SidebarMenuButton>
                    <Settings />
                    <span>Settings</span>
                  </SidebarMenuButton>
                </SettingsDialog>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleLogOut}
                  className="capitalize"
                >
                  <LogOut />
                  <span>Sign out</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="capitalize"
              size={open ? "lg" : "default"}
            >
              {isPending ? (
                <>
                  <User2 /> <Skeleton className="w-18 h-4" />
                </>
              ) : (
                <>
                  <UserAvatar
                    alt={data?.data?.name ?? ""}
                    name={data?.data?.name ?? ""}
                  />
                  <span>{data?.data?.name}</span>
                </>
              )}
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </UiSidebar>
  );
};

export default Sidebar;
