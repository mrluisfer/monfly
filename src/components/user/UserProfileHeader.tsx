import UserAvatar from "~/components/shared/UserAvatar";
import { CircleUserIcon, MailIcon } from "lucide-react";

interface User {
  name?: string | null;
  email?: string | null;
}

interface UserProfileHeaderProps {
  user: User;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  if (!user || !user.name) {
    return (
      <header className="flex items-center gap-3 rounded-2xl border border-dashed border-border/60 bg-card/40 p-4">
        <CircleUserIcon
          className="size-5 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="text-sm text-muted-foreground">
          User information not loaded
        </p>
      </header>
    );
  }

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-4">
        <span
          aria-hidden="true"
          className="relative inline-flex shrink-0 rounded-full ring-1 ring-foreground/10 ring-offset-2 ring-offset-background"
        >
          <UserAvatar alt={user.name} name={user.name} size={56} />
          <span className="absolute -bottom-0.5 -right-0.5 inline-flex size-3.5 items-center justify-center rounded-full border-2 border-background bg-emerald-500" />
        </span>

        <div className="min-w-0 space-y-1">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.13em] text-muted-foreground">
            Welcome back
          </p>
          <h1 className="font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {user.name}
          </h1>
          {user.email ? (
            <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MailIcon className="size-3.5" aria-hidden="true" />
              <span className="truncate">{user.email}</span>
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
