import { useEffect, useState } from "react";
import { Badge } from "~/components/ui/badge";
import { cn } from "~/lib/utils";
import { format } from "date-fns";
import { Clock, ZapIcon } from "lucide-react";
import { HeaderBadge } from "./HeaderBadge";

interface TimezoneBadgeProps {
  variant?: "default" | "secondary" | "outline" | "destructive";
  showIcon?: boolean;
  showTimezone?: boolean;
  animate?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  isActive?: boolean;
  className?: string;
}

export const TimezoneBadge = ({
  variant = "outline",
  showIcon = true,
  showTimezone = true,
  animate = true,
  compact = false,
  fullWidth = false,
  isActive = true,
  className = "",
}: TimezoneBadgeProps) => {
  const [now, setNow] = useState<Date | null>(null);
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  useEffect(() => {
    if (!isActive) return;

    setNow(new Date());

    const intervalMs = compact ? 60_000 : 30_000;
    const timer = window.setInterval(() => setNow(new Date()), intervalMs);

    return () => window.clearInterval(timer);
  }, [compact, isActive]);

  if (!isActive) {
    return null;
  }

  const shortTimezone = timezone.split("/").pop() ?? timezone;

  if (!now) {
    return (
      <Badge
        variant={variant}
        className={cn(
          "inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3 py-1.5 text-foreground shadow-xs backdrop-blur-[2px]",
          fullWidth && "h-10 w-full rounded-xl px-3.5 py-2",
          compact && "h-8 px-2.5 py-1",
          !compact && !fullWidth && "h-9",
          className
        )}
      >
        {showIcon && (
          <Clock
            className="h-3.5 w-3.5 shrink-0 opacity-60"
            aria-hidden="true"
          />
        )}
        <span className="truncate font-mono text-xs">Loading...</span>
      </Badge>
    );
  }

  const timeFormatted = format(now, "HH:mm");
  const dateFormatted = format(now, "MMM dd, yyyy");
  const fullFormatted = format(now, "PPpp");

  return (
    <HeaderBadge
      variant={variant}
      compact={compact}
      fullWidth={fullWidth}
      isActive={isActive}
      className={className}
      tooltipContent={
        <div className="space-y-1">
          <div className="font-mono font-semibold">{fullFormatted}</div>
          <div className="text-[10px]">Timezone: {timezone}</div>
        </div>
      }
      tooltipClassName="font-mono text-xs"
    >
      {showIcon && (
        <ZapIcon
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-primary",
            fullWidth && "h-4 w-4",
            animate ? "animate-pulse" : "opacity-60"
          )}
          aria-hidden="true"
        />
      )}

      <span
        className={cn(
          "inline-flex min-w-0 flex-col items-start leading-none",
          compact && "flex-row items-center gap-1.5",
          fullWidth && "flex-1"
        )}
      >
        <span className="font-mono text-xs font-semibold tracking-tight tabular-nums">
          {timeFormatted}
        </span>

        {!compact && (
          <span className="truncate text-[10px]">
            {dateFormatted}
            {showTimezone && (
              <span className="ml-1 opacity-70">. {shortTimezone}</span>
            )}
          </span>
        )}

        {compact && showTimezone && (
          <span className="truncate text-[10px] opacity-75">
            {shortTimezone}
          </span>
        )}
      </span>
    </HeaderBadge>
  );
};
