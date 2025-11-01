import { useQuery } from "@tanstack/react-query";
import { useLocation, useNavigate } from "@tanstack/react-router";
import { sidebarRoutes } from "~/constants/sidebar-routes";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { queryDictionary } from "~/queries/dictionary";
import { BadgeHelp, LogOut, Settings, User2 } from "lucide-react";

import { SettingsDialog } from "../settings/settings-dialog";
import {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  Sidebar as UiSidebar,
  useSidebar,
} from "../ui/sidebar";
import { Skeleton } from "../ui/skeleton";
import UserAvatar from "../user-avatar";
import { SidebarItem } from "./sidebar-item";
import { SignOutDialog } from "./sign-out-dialog";

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

  if (error) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <UiSidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem></SidebarMenuItem>
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
                <SidebarItem
                  title={item.title}
                  disabled={item?.disabled}
                  url={item.url}
                  key={item.title}
                >
                  <item.icon className="text-secondary-foreground" />{" "}
                  {item.title}
                </SidebarItem>
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
              <SidebarItem url="/help" title="Help" disabled>
                <BadgeHelp className="text-secondary-foreground" />
                <span>Help</span>
              </SidebarItem>

              <SettingsDialog>
                <SidebarItem title="Settings">
                  <Settings className="text-secondary-foreground" />
                  <span>Settings</span>
                </SidebarItem>
              </SettingsDialog>

              <SignOutDialog>
                <SidebarItem title="Sign out">
                  <LogOut className="text-secondary-foreground" />
                  <span>Sign out</span>
                </SidebarItem>
              </SignOutDialog>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarItem
            title="Profile"
            url={`/user/${data?.data?.id}`}
            disabled={!data?.data?.id}
          >
            {isPending ? (
              <>
                <User2 /> <Skeleton className="w-18 h-4" />
              </>
            ) : (
              <>
                {open ? (
                  <UserAvatar
                    alt={data?.data?.name ?? ""}
                    name={data?.data?.name ?? ""}
                  />
                ) : (
                  <User2 className="text-secondary-foreground" />
                )}
                <span>{data?.data?.name}</span>
              </>
            )}
          </SidebarItem>
        </SidebarMenu>
      </SidebarFooter>
    </UiSidebar>
  );
};

export default Sidebar;
