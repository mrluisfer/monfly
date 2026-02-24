import { useState } from "react";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { SignOutDialog } from "~/components/sidebar/sign-out-dialog";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import UserAvatar from "~/components/user-avatar";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { queryDictionary } from "~/queries/dictionary";
import type { ApiResponse } from "~/types/ApiResponse";

import ProfileSettings from "./profile-settings";

export default function UserDropdown() {
  const userEmail = useRouteUser();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [signOutDialogOpen, setSignOutDialogOpen] = useState(false);
  const [profileSettingsOpen, setProfileSettingsOpen] = useState(false);

  const { data, isPending, error } = useQuery<ApiResponse<User | null>>({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: Boolean(userEmail), // Only run query if userEmail exists
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  const openMenuActionDialog = (action: "profile-settings" | "sign-out") => {
    setDropdownOpen(false);
    if (action === "profile-settings") {
      setProfileSettingsOpen(true);
      return;
    }
    setSignOutDialogOpen(true);
  };

  // Get user data safely
  const user = data?.data;
  const userName = user?.name ?? "User";

  // Handle loading state
  if (isPending) {
    return (
      <Button variant="outline" size="icon" className="rounded-full" disabled>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="sr-only">Loading user...</span>
      </Button>
    );
  }

  // Handle error or missing data
  if (error || data?.error || !user) {
    return (
      <Button variant="outline" size="icon" className="rounded-full" disabled>
        <UserAvatar alt="?" name="?" />
        <span className="sr-only">User data unavailable</span>
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size={"icon"} className="rounded-full">
            <UserAvatar alt={userName} name={userName} />
            <span className="sr-only">{userName}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => {
                openMenuActionDialog("profile-settings");
              }}
            >
              Profile Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onSelect={() => {
                openMenuActionDialog("sign-out");
              }}
              className="text-destructive focus:text-destructive"
            >
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <SignOutDialog
        open={signOutDialogOpen}
        onOpenChange={setSignOutDialogOpen}
      />

      <ProfileSettings
        open={profileSettingsOpen}
        onOpenChange={setProfileSettingsOpen}
      />
    </>
  );
}
