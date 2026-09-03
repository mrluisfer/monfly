import { Wifi, WifiOff } from "lucide-react";
import { useEffect, useReducer } from "react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface OnlineStatusBadgeProps {
  animate?: boolean;
  className?: string;
  compact?: boolean;
  fullWidth?: boolean;
  isActive?: boolean;
  showIcon?: boolean;
  variant?: "default" | "secondary" | "outline";
}

const statusConfig = {
  offline: {
    color: "bg-zinc-400 dark:bg-zinc-600",
    compactLabel: "Offline",
    description: "You are not connected to the internet.",
    icon: WifiOff,
    label: "Offline",
  },
  online: {
    color: "bg-emerald-500",
    compactLabel: "Online",
    description: "You are connected to the internet.",
    icon: Wifi,
    label: "Online",
  },
} as const;

export function OnlineStatusBadge({
  showIcon = true,
  animate = true,
  compact = false,
  fullWidth = false,
  isActive = true,
  variant = "outline",
  className = "",
}: OnlineStatusBadgeProps) {
  const [{ isOnline, lastChanged }, dispatch] = useReducer(
    (
      state: { isOnline: boolean; lastChanged: number | null },
      action:
        | { type: "sync"; value: boolean }
        | { type: "online" }
        | { type: "offline" },
    ) => {
      if (action.type === "sync") {
        return {
          ...state,
          isOnline: action.value,
        };
      }

      if (action.type === "online") {
        if (state.isOnline) {
          return state;
        }
        return { isOnline: true, lastChanged: Date.now() };
      }

      if (!state.isOnline) {
        return state;
      }
      return { isOnline: false, lastChanged: Date.now() };
    },
    {
      isOnline: typeof window === "undefined" ? true : window.navigator.onLine,
      lastChanged: null,
    },
  );

  useEffect(() => {
    if (!isActive) {
      return;
    }

    dispatch({ type: "sync", value: window.navigator.onLine });

    const handleOnline = () => {
      dispatch({ type: "online" });
    };

    const handleOffline = () => {
      dispatch({ type: "offline" });
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, [isActive]);

  const config = isOnline ? statusConfig.online : statusConfig.offline;
  const Icon = config.icon;

  let timeAgo: string | null = null;
  if (lastChanged) {
    // Relative "time ago" label inherently reads the current time on render.
    // eslint-disable-next-line react-hooks/purity
    const seconds = Math.floor((Date.now() - lastChanged) / 1000);
    if (seconds < 60) {
      timeAgo = `${seconds}s ago`;
    } else if (seconds < 3600) {
      timeAgo = `${Math.floor(seconds / 60)}m ago`;
    } else if (seconds < 86_400) {
      timeAgo = `${Math.floor(seconds / 3600)}h ago`;
    } else {
      timeAgo = `${Math.floor(seconds / 86_400)}d ago`;
    }
  }

  if (!isActive) {
    return null;
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <Badge
              variant={variant}
              className={cn(
                "inline-flex min-w-0 max-w-full select-none items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3 py-1.5 text-foreground shadow-xs backdrop-blur-[2px] transition-colors duration-200 hover:bg-muted/70",
                fullWidth && "h-10 w-full rounded-xl px-3.5 py-2",
                compact && "h-8 px-2.5 py-1",
                !(compact || fullWidth) && "h-9",
                className,
              )}
            >
              <span
                className={cn(
                  "relative inline-flex size-2 rounded-full",
                  config.color,
                )}
                aria-hidden="true"
              >
                {animate && isOnline ? (
                  <span
                    className={cn(
                      "absolute inline-flex size-full animate-ping rounded-full opacity-75",
                      config.color,
                    )}
                  />
                ) : null}
              </span>

              {showIcon ? (
                <Icon
                  className={cn(
                    "size-3.5 shrink-0 opacity-75",
                    fullWidth && "size-4",
                  )}
                  aria-hidden="true"
                />
              ) : null}

              <span
                className={cn(
                  "min-w-0 truncate font-medium text-xs",
                  fullWidth && "flex-1",
                )}
              >
                {compact ? config.compactLabel : config.label}
              </span>
            </Badge>
          }
        />

        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
              <span className="font-semibold text-xs">
                Connection Status: {config.label}
              </span>
            </div>
            <p className="text-[10px]">{config.description}</p>
            {timeAgo ? (
              <p className="mt-1 border-border border-t pt-1 text-[10px]">
                Status changed {timeAgo}
              </p>
            ) : null}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
