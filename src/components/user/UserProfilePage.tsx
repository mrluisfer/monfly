import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";

import { UserProfileForm } from "./UserProfileForm";
import { UserProfileHeader } from "./UserProfileHeader";

interface User {
  id: string;
  email: string;
  name?: string | null;
  totalBalance?: number | null;
}

interface UserProfilePageProps {
  userId: string;
  user: User;
}

export function UserProfilePage({ userId, user }: UserProfilePageProps) {
  return (
    <div className="min-h-screen bg-background px-4 py-8">
      <Card className="mx-auto w-full max-w-2xl">
        <UserProfileHeader user={user} />
        <CardContent>
          <UserProfileForm userId={userId} user={user} />
        </CardContent>
      </Card>

      {!user && (
        <div className="mx-auto mt-6 w-full max-w-2xl space-y-4">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      )}
    </div>
  );
}
