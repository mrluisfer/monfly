import { Skeleton } from "~/components/ui/skeleton";

import { UserProfileForm } from "./UserProfileForm";
import { UserProfileHeader } from "./UserProfileHeader";

interface User {
  id: string;
  email: string;
  name?: string | null;
  totalBalance?: number | null;
  preferredCurrency?: string | null;
  marketingOptIn?: boolean | null;
  productUpdatesOptIn?: boolean | null;
  acceptedTermsAt?: string | Date | null;
  acceptedPrivacyAt?: string | Date | null;
  avatarSeed?: string | null;
}

interface UserProfilePageProps {
  userId: string;
  user: User;
}

export function UserProfilePage({ userId, user }: UserProfilePageProps) {
  if (!user) {
    return (
      <div className="bg-background relative min-h-dvh px-4 py-10 sm:px-6 sm:py-14">
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-5 w-96" />
          <div className="grid gap-4 pt-6">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background relative min-h-dvh overflow-x-clip">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--primary)/8%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 right-0 -z-10 size-72 rounded-full bg-[radial-gradient(circle,#0f766e_0%,transparent_72%)] opacity-15 blur-3xl dark:opacity-20"
      />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-8 sm:py-14 md:max-w-6xl lg:container lg:max-w-none lg:py-16">
        <UserProfileHeader user={user} />

        <div className="mt-10 sm:mt-14">
          <UserProfileForm userId={userId} user={user} />
        </div>
      </main>
    </div>
  );
}
