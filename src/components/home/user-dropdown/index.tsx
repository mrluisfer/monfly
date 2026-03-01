import { useEffect, useRef, useState } from "react";
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
  const [activeDialog, setActiveDialog] = useState<
    "profile-settings" | "sign-out" | null
  >(null);
  const pendingActionRef = useRef<"profile-settings" | "sign-out" | null>(null);

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
    pendingActionRef.current = action;
    setDropdownOpen(false);
  };

  useEffect(() => {
    if (dropdownOpen || !pendingActionRef.current) return;

    // Defer dialog mount until after dropdown teardown to avoid portal race conditions.
    const timer = window.setTimeout(() => {
      setActiveDialog(pendingActionRef.current);
      pendingActionRef.current = null;
    }, 0);

    return () => window.clearTimeout(timer);
  }, [dropdownOpen]);

  // Get user data safely
  const user = data?.data;
  const userName = user?.name ?? "User";

  // Handle loading state
  if (isPending) {
    return (
      <Button
        variant="outline"
        size="icon-lg"
        className="rounded-full"
        disabled
      >
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <span className="sr-only">Loading user...</span>
      </Button>
    );
  }

  // Handle error or missing data
  if (error || data?.error || !user) {
    return (
      <Button
        variant="outline"
        size="icon-lg"
        className="rounded-full"
        disabled
      >
        <UserAvatar alt="?" name="?" />
        <span className="sr-only">User data unavailable</span>
      </Button>
    );
  }

  return (
    <>
      <DropdownMenu open={dropdownOpen} onOpenChange={setDropdownOpen}>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size={"icon"} className="rounded-full">
              <UserAvatar alt={userName} name={userName} />
              <span className="sr-only">{userName}</span>
            </Button>
          }
        />
        <DropdownMenuContent>
          <DropdownMenuGroup>
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
                openMenuActionDialog("profile-settings");
              }}
            >
              Profile Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem
              onClick={() => {
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
        open={activeDialog === "sign-out"}
        onOpenChange={(open) => {
          if (!open) setActiveDialog(null);
        }}
      />

      <ProfileSettings
        open={activeDialog === "profile-settings"}
        onOpenChange={(open) => {
          if (!open) setActiveDialog(null);
        }}
      />
    </>
  );
}
