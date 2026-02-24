import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import UserAvatar from "~/components/user-avatar";
import { UserIcon } from "lucide-react";

interface User {
  name?: string | null;
}

interface UserProfileHeaderProps {
  user: User;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  if (!user || !user.name) {
    return (
      <CardHeader className="border-b pb-4 sm:pb-6">
        <div className="flex items-start gap-3 sm:items-center sm:gap-4">
          <UserIcon />
          <p>User information not loaded</p>
        </div>
      </CardHeader>
    );
  }

  return (
    <CardHeader className="space-y-2 border-b pb-4 sm:pb-6">
      <div className="flex items-start gap-3 sm:items-center sm:gap-4">
        <UserAvatar alt={user.name} name={user.name} size={44} />
        <div className="space-y-1">
          <CardTitle className="text-lg sm:text-xl">Update Profile</CardTitle>
          <CardDescription>Manage your account information.</CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
