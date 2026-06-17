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
  CHANGE_PASSWORD_PATH,
  HELP_PATH,
  SETTINGS_PATH,
} from "./sidebar-constants";
import { getActivePath, resolveRoutePath } from "./utils";

type SecondaryItem = {
  key: string;
  label: string;
  icon: typeof UserIcon;
  to: string;
  params?: Record<string, string>;
  variant?: "default" | "destructive";
};

type SecondaryGroup = {
  key: string;
  label?: string;
  items: SecondaryItem[];
};

export function NavSecondary() {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const userEmail = useRouteUser();

  const { data } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
  });

  const userId = data?.data?.id;

  const groups: SecondaryGroup[] = [
    {
      key: "account",
      label: "Account",
      items: [
        ...(userId
          ? [
              {
                key: "profile",
                label: "Profile",
                icon: UserIcon,
                to: "/user/$userId",
                params: { userId },
              },
            ]
          : []),
        {
          key: "change-password",
          label: "Change Password",
          icon: KeyRoundIcon,
          to: CHANGE_PASSWORD_PATH,
        },
        {
          key: "settings",
          label: "Settings",
          icon: SettingsIcon,
          to: SETTINGS_PATH,
        },
      ],
    },
    {
      key: "support",
      label: "Support",
      items: [
        {
          key: "help",
          label: "Help",
          icon: LifeBuoyIcon,
          to: HELP_PATH,
        },
        {
          key: "signout",
          label: "Sign Out",
          icon: LogOutIcon,
          to: "/signout",
          variant: "destructive",
        },
      ],
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
                      "data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:font-medium",
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
