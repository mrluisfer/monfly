"use client";

import { useQueryClient } from "@tanstack/react-query";
import { CircleUserIcon, MailIcon, RefreshCwIcon } from "lucide-react";
import { useState } from "react";

import UserAvatar from "~/components/shared/UserAvatar";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { updateUserAvatarServer } from "~/lib/api/user/update-user-avatar";
import { sileo } from "~/lib/toaster";
import { invalidateUserQueries } from "~/utils/query-invalidation";

interface User {
  name?: string | null;
  email?: string | null;
  avatarSeed?: string | null;
}

interface UserProfileHeaderProps {
  user: User;
}

export function UserProfileHeader({ user }: UserProfileHeaderProps) {
  const queryClient = useQueryClient();
  // Persisted seed override so the reshuffled avatar survives reloads.
  // Initialized from the saved value; `null` falls back to the name-derived avatar.
  const [seed, setSeed] = useState<string | null>(user.avatarSeed ?? null);

  const avatarMutation = useMutation({
    fn: updateUserAvatarServer,
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        sileo.error({ title: "Couldn't save the new avatar" });
        return;
      }
      if (user.email) {
        await invalidateUserQueries(queryClient, user.email);
      }
    },
  });

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

  const reshuffle = () => {
    const next = `${user.name}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
    setSeed(next);
    void avatarMutation.mutate({ data: { avatarSeed: next } });
  };

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="ring-foreground/10 ring-offset-background relative inline-flex shrink-0 rounded-full ring-1 ring-offset-2"
        >
          <UserAvatar
            alt={user.name}
            name={user.name}
            seed={seed ?? undefined}
            size={56}
          />
          <span className="border-background absolute -right-0.5 -bottom-0.5 inline-flex size-3.5 items-center justify-center rounded-full border-2 bg-emerald-500" />
        </span>

        <Tooltip>
          <TooltipTrigger
            render={
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={reshuffle}
                disabled={avatarMutation.status === "pending"}
                aria-label="Shuffle profile picture"
                className="text-muted-foreground hover:text-foreground size-8 shrink-0 rounded-full"
              >
                <RefreshCwIcon
                  className={
                    avatarMutation.status === "pending"
                      ? "size-4 animate-spin"
                      : "size-4"
                  }
                  aria-hidden="true"
                />
              </Button>
            }
          />
          <TooltipContent sideOffset={6}>
            Generate a new profile picture
          </TooltipContent>
        </Tooltip>

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
