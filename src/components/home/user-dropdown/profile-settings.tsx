import { ReactNode } from "react";
import { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTrigger } from "~/components/ui/dialog";
import { UserProfileForm } from "~/components/user/UserProfileForm";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { queryDictionary } from "~/queries/dictionary";
import type { ApiResponse } from "~/types/ApiResponse";

interface ProfileSettingsProps {
  children?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

/**
 * ProfileSettings Component
 *
 * Supports both controlled and uncontrolled modes:
 * - Controlled: Pass `open` and `onOpenChange` props for external state management
 * - Uncontrolled: Pass `children` as trigger element for internal state management
 *
 * @param children - React node to be used as dialog trigger (uncontrolled mode only)
 * @param open - Controls the dialog open state (controlled mode)
 * @param onOpenChange - Callback when dialog open state changes (controlled mode)
 */
export default function ProfileSettings({
  children,
  open,
  onOpenChange,
}: ProfileSettingsProps) {
  const userEmail = useRouteUser();

  // Determine if we're in controlled mode
  const isControlled = open !== undefined && onOpenChange !== undefined;

  const { data, isPending, error } = useQuery<ApiResponse<User | null>>({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: Boolean(userEmail), // Only run query if userEmail exists
  });

  // Helper function to render dialog with appropriate props
  const renderDialog = (content: ReactNode) => {
    if (isControlled) {
      return (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent>{content}</DialogContent>
        </Dialog>
      );
    }

    return (
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>{content}</DialogContent>
      </Dialog>
    );
  };

  // Handle case where userEmail is not available
  if (!userEmail) {
    return renderDialog(
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-muted-foreground">
          No user session found. Please log in.
        </div>
      </div>
    );
  }

  // Handle loading state
  if (isPending) {
    return renderDialog(
      <div className="flex items-center justify-center p-8 space-x-2">
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
        <div className="text-sm text-muted-foreground">
          Loading user profile...
        </div>
      </div>
    );
  }

  // Handle error state
  if (error) {
    return renderDialog(
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-red-500">
          Error loading profile: {error.message}
        </div>
      </div>
    );
  }

  // Handle API error response
  if (data?.error || !data?.data) {
    return renderDialog(
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-red-500">
          {data?.message || "User not found"}
        </div>
      </div>
    );
  }

  // Handle case where user data exists but ID might be undefined
  const user = data.data;

  // Type guard to ensure user is not null and has required fields
  if (!user || !user.id || !user.email) {
    return renderDialog(
      <div className="flex items-center justify-center p-8">
        <div className="text-sm text-red-500">
          Invalid user data: missing required fields
        </div>
      </div>
    );
  }

  const userId = user.id;

  return renderDialog(<UserProfileForm user={user} userId={userId} />);
}
