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
  avatarSeed?: string | null;
  email?: string | null;
  name?: string | null;
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

  if (!user.name) {
    return (
      <header className="flex items-center gap-3 rounded-2xl border border-border/60 border-dashed bg-card/40 p-4">
        <CircleUserIcon
          className="size-5 text-muted-foreground"
          aria-hidden="true"
        />
        <p className="text-muted-foreground text-sm">
          User information not loaded
        </p>
      </header>
    );
  }

  const reshuffle = async () => {
    const next = `${user.name}-${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
    setSeed(next);
    await avatarMutation.mutate({ data: { avatarSeed: next } });
  };

  return (
    <header className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="relative inline-flex shrink-0 rounded-full ring-1 ring-foreground/10 ring-offset-2 ring-offset-background"
        >
          <UserAvatar
            alt={user.name}
            name={user.name}
            seed={seed ?? undefined}
            size={56}
          />
          <span className="absolute -right-0.5 -bottom-0.5 inline-flex size-3.5 items-center justify-center rounded-full border-2 border-background bg-emerald-500" />
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
                className="size-8 shrink-0 rounded-full text-muted-foreground hover:text-foreground"
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
          <p className="font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.13em]">
            Welcome back
          </p>
          <h1 className="font-[family-name:var(--font-syne)] font-semibold text-2xl text-foreground tracking-tight sm:text-3xl">
            {user.name}
          </h1>
          {user.email ? (
            <p className="flex items-center gap-1.5 text-muted-foreground text-sm">
              <MailIcon className="size-3.5" aria-hidden="true" />
              <span className="truncate">{user.email}</span>
            </p>
          ) : null}
        </div>
      </div>
    </header>
  );
}
