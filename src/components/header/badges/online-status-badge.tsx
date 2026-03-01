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
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

export function OnlineStatusBadge({
  showIcon = true,
  animate = true,
  variant = "secondary",
  className = "",
}: OnlineStatusBadgeProps) {
  const [state, dispatch] = useReducer(
    (
      _prev: { isOnline: boolean; lastChanged: Date | null },
      nextOnline: boolean
    ) => ({
      isOnline: nextOnline,
      lastChanged: new Date(),
    }),
    {
      isOnline: typeof window !== "undefined" ? window.navigator.onLine : true,
      lastChanged: null,
    }
  );
  const { isOnline, lastChanged } = state;

  useEffect(() => {
    function handleOnline() {
      dispatch(true);
    }
    function handleOffline() {
      dispatch(false);
    }

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  const statusConfig = {
    online: {
      label: "Online",
      color: "bg-emerald-500",
      icon: Wifi,
      description: "You are connected to the internet.",
    },
    offline: {
      label: "Offline",
      color: "bg-zinc-400 dark:bg-zinc-600",
      icon: WifiOff,
      description: "You are not connected to the internet.",
    },
  };

  const config = isOnline ? statusConfig.online : statusConfig.offline;
  const Icon = config.icon;

  const getTimeAgo = () => {
    if (!lastChanged) return null;
    const seconds = Math.floor(
      (new Date().getTime() - lastChanged.getTime()) / 1000
    );

    if (seconds < 60) return `${seconds}s ago`;
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    return `${Math.floor(seconds / 86400)}d ago`;
  };

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Badge
            variant={variant}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 select-none transition-all hover:scale-105",
              className
            )}
          >
            <span
              className={cn("relative flex h-2 w-2 rounded-full", config.color)}
              aria-hidden="true"
            >
              {animate && isOnline && (
                <>
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                      config.color
                    )}
                  />
                  <span
                    className={cn(
                      "relative inline-flex h-2 w-2 rounded-full",
                      config.color
                    )}
                  />
                </>
              )}
            </span>

            {showIcon && (
              <Icon className="h-3 w-3 opacity-70" aria-hidden="true" />
            )}

            <span className="text-xs font-medium">{config.label}</span>
          </Badge>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
              <span className="font-semibold text-xs">
                Connection Status: {config.label}
              </span>
            </div>
            <p className="text-[10px]">{config.description}</p>
            {lastChanged && (
              <p className="text-[10px] border-t border-border pt-1 mt-1">
                Status changed {getTimeAgo()}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
