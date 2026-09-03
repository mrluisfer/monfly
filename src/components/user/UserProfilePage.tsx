import { Skeleton } from "~/components/ui/skeleton";

import { UserProfileForm } from "./UserProfileForm";
import { UserProfileHeader } from "./UserProfileHeader";

interface User {
  acceptedPrivacyAt?: string | Date | null;
  acceptedTermsAt?: string | Date | null;
  avatarSeed?: string | null;
  email: string;
  id: string;
  marketingOptIn?: boolean | null;
  name?: string | null;
  preferredCurrency?: string | null;
  productUpdatesOptIn?: boolean | null;
  totalBalance?: number | null;
}

interface UserProfilePageProps {
  user: User;
}

export function UserProfilePage({ user }: UserProfilePageProps) {
  if (!user) {
    return (
      <div className="relative min-h-dvh bg-background px-4 py-10 sm:px-6 sm:py-14">
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
    <div className="relative min-h-dvh overflow-x-clip bg-background">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-20 left-1/2 -z-10 size-[40rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,var(--primary)/8%,transparent_70%)] blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-40 right-0 -z-10 size-72 rounded-full bg-[radial-gradient(circle,#0f766e_0%,transparent_72%)] opacity-15 blur-3xl dark:opacity-20"
      />

      <main className="mx-auto w-full max-w-4xl px-4 py-10 lg:container sm:px-8 sm:py-14 md:max-w-6xl lg:max-w-none lg:py-16">
        <UserProfileHeader user={user} />

        <div className="mt-10 sm:mt-14">
          <UserProfileForm user={user} />
        </div>
      </main>
    </div>
  );
}
