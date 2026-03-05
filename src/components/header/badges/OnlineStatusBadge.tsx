import { useEffect, useReducer } from "react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import { Wifi, WifiOff } from "lucide-react";

interface OnlineStatusBadgeProps {
  showIcon?: boolean;
  animate?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  isActive?: boolean;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

const statusConfig = {
  online: {
    label: "Online",
    compactLabel: "Online",
    color: "bg-emerald-500",
    icon: Wifi,
    description: "You are connected to the internet.",
  },
  offline: {
    label: "Offline",
    compactLabel: "Offline",
    color: "bg-zinc-400 dark:bg-zinc-600",
    icon: WifiOff,
    description: "You are not connected to the internet.",
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
        | { type: "offline" }
    ) => {
      if (action.type === "sync") {
        return {
          ...state,
          isOnline: action.value,
        };
      }

      if (action.type === "online") {
        if (state.isOnline) return state;
        return { isOnline: true, lastChanged: Date.now() };
      }

      if (!state.isOnline) return state;
      return { isOnline: false, lastChanged: Date.now() };
    },
    {
      isOnline: typeof window === "undefined" ? true : window.navigator.onLine,
      lastChanged: null,
    }
  );

  useEffect(() => {
    if (!isActive) return;

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
    const seconds = Math.floor((Date.now() - lastChanged) / 1000);
    if (seconds < 60) {
      timeAgo = `${seconds}s ago`;
    } else if (seconds < 3600) {
      timeAgo = `${Math.floor(seconds / 60)}m ago`;
    } else if (seconds < 86400) {
      timeAgo = `${Math.floor(seconds / 3600)}h ago`;
    } else {
      timeAgo = `${Math.floor(seconds / 86400)}d ago`;
    }
  }

  if (!isActive) {
    return null;
  }

  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Badge
              variant={variant}
              className={cn(
                "inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3 py-1.5 text-foreground shadow-xs backdrop-blur-[2px] select-none transition-colors duration-200 hover:bg-muted/70",
                fullWidth && "h-10 w-full rounded-xl px-3.5 py-2",
                compact && "h-8 px-2.5 py-1",
                !compact && !fullWidth && "h-9",
                className
              )}
            >
              <span
                className={cn(
                  "relative inline-flex h-2 w-2 rounded-full",
                  config.color
                )}
                aria-hidden="true"
              >
                {animate && isOnline && (
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                      config.color
                    )}
                  />
                )}
              </span>

              {showIcon && (
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0 opacity-75",
                    fullWidth && "h-4 w-4"
                  )}
                  aria-hidden="true"
                />
              )}

              <span
                className={cn(
                  "min-w-0 truncate text-xs font-medium",
                  fullWidth && "flex-1"
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
              <span className="text-xs font-semibold">
                Connection Status: {config.label}
              </span>
            </div>
            <p className="text-[10px]">{config.description}</p>
            {timeAgo && (
              <p className="mt-1 border-t border-border pt-1 text-[10px]">
                Status changed {timeAgo}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
