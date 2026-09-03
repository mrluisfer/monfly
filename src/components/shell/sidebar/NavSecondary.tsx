import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import {
  KeyRoundIcon,
  LifeBuoyIcon,
  LogOutIcon,
  SettingsIcon,
  UserIcon,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useRouteUser } from "@/hooks";
import { getUserByEmailServer } from "@/lib/api/user/get-user-by-email";
import { cn } from "@/lib/utils";
import { queryDictionary } from "@/queries/dictionary";
import {
  CHANGE_PASSWORD_PATH,
  HELP_PATH,
  SETTINGS_PATH,
} from "./sidebar-constants";
import { getActivePath, resolveRoutePath } from "./utils";

interface SecondaryItem {
  icon: typeof UserIcon;
  key: string;
  label: string;
  params?: Record<string, string>;
  to: string;
  variant?: "default" | "destructive";
}

interface SecondaryGroup {
  items: SecondaryItem[];
  key: string;
  label?: string;
}

export function NavSecondary() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const userEmail = useRouteUser();

  const { data } = useQuery({
    enabled: !!userEmail,
    gcTime: 1000 * 60 * 10,
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    queryKey: [queryDictionary.user, userEmail],
    retry: 1,
    staleTime: 1000 * 60 * 5,
  });

  const userId = data?.data?.id;

  const groups: SecondaryGroup[] = [
    {
      items: [
        ...(userId
          ? [
              {
                icon: UserIcon,
                key: "profile",
                label: "Profile",
                params: { userId },
                to: "/user/$userId",
              },
            ]
          : []),
        {
          icon: KeyRoundIcon,
          key: "change-password",
          label: "Change Password",
          to: CHANGE_PASSWORD_PATH,
        },
        {
          icon: SettingsIcon,
          key: "settings",
          label: "Settings",
          to: SETTINGS_PATH,
        },
      ],
      key: "account",
      label: "Account",
    },
    {
      items: [
        {
          icon: LifeBuoyIcon,
          key: "help",
          label: "Help",
          to: HELP_PATH,
        },
        {
          icon: LogOutIcon,
          key: "signout",
          label: "Sign Out",
          to: "/signout",
          variant: "destructive",
        },
      ],
      key: "support",
      label: "Support",
    },
  ];

  // Resolve the single most-specific active item across all groups, so nested
  // routes don't light up both the leaf and its ancestor.
  const activePath = getActivePath(
    location.pathname,
    groups.flatMap((group) =>
      group.items.map((item) => resolveRoutePath(item.to, item.params)),
    ),
  );

  return (
    <SidebarGroup className="mt-auto">
      {groups.map((group) => (
        <SidebarGroupContent key={group.key} className="not-last:mb-1">
          {group.label ? (
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
          ) : null}
          <SidebarMenu>
            {group.items.map((item) => {
              const Icon = item.icon;
              const active =
                resolveRoutePath(item.to, item.params) === activePath;
              const isDestructive = item.variant === "destructive";
              return (
                <SidebarMenuItem key={item.key}>
                  <SidebarMenuButton
                    tooltip={item.label}
                    isActive={active}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground",
                      "transition-colors",
                      isDestructive &&
                        "text-destructive hover:text-destructive focus-visible:text-destructive [&_svg]:text-destructive",
                    )}
                    render={
                      <Link
                        to={item.to}
                        params={item.params}
                        onClick={() => setOpenMobile(false)}
                      />
                    }
                  >
                    <Icon aria-hidden="true" />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroupContent>
      ))}
    </SidebarGroup>
  );
}
