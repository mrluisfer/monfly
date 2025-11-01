import { CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import UserAvatar from "~/components/user-avatar";
import { User2, UserIcon } from "lucide-react";

interface User {
  name?: string | null;
}

interface UserProfileHeaderProps {
  user: User;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  if (!user || !user.name) {
    return (
      <CardHeader>
        <div className="flex items-center gap-4">
          <UserIcon />
          <p>User information not loaded</p>
        </div>
      </CardHeader>
    );
  }

  return (
    <CardHeader className="space-y-2">
      <div className="flex items-center gap-4">
        <UserAvatar alt={user.name} name={user.name} size={40} />
        <div>
          <CardTitle>Update Profile</CardTitle>
          <CardDescription>Manage your account information.</CardDescription>
        </div>
      </div>
    </CardHeader>
  );
}
