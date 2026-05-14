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
      <header className="border-border/60 bg-card/40 flex items-center gap-3 rounded-2xl border border-dashed p-4">
        <CircleUserIcon
          className="text-muted-foreground size-5"
          aria-hidden="true"
        />
        <p className="text-muted-foreground text-sm">
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
          className="ring-foreground/10 ring-offset-background relative inline-flex shrink-0 rounded-full ring-1 ring-offset-2"
        >
          <UserAvatar alt={user.name} name={user.name} size={56} />
          <span className="border-background absolute -right-0.5 -bottom-0.5 inline-flex size-3.5 items-center justify-center rounded-full border-2 bg-emerald-500" />
        </span>

        <div className="min-w-0 space-y-1">
          <p className="text-muted-foreground text-[0.7rem] font-semibold tracking-[0.13em] uppercase">
            Welcome back
          </p>
          <h1 className="text-foreground font-[family-name:var(--font-syne)] text-2xl font-semibold tracking-tight sm:text-3xl">
            {user.name}
          </h1>
          {user.email ? (
            <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
              <MailIcon className="size-3.5" aria-hidden="true" />
              <span className="truncate">{user.email}</span>
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
