import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Clock, ZapIcon } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface TimezoneBadgeProps {
  variant?: "default" | "secondary" | "outline" | "destructive";
  showIcon?: boolean;
  showTimezone?: boolean;
  animate?: boolean;
  className?: string;
}

export const TimezoneBadge = ({
  variant = "secondary",
  showIcon = true,
  showTimezone = true,
  animate = true,
  className = "",
}: TimezoneBadgeProps) => {
  const [now, setNow] = useState(new Date());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <Badge
        variant={variant}
        className={`inline-flex items-center gap-2 ${className}`}
      >
        {showIcon && (
          <Clock className="h-3 w-3 opacity-60" aria-hidden="true" />
        )}
        <span className="font-mono text-xs">Loading...</span>
      </Badge>
    );
  }

  const timeFormatted = format(now, "HH:mm:ss");
  const dateFormatted = format(now, "MMM dd, yyyy");
  const fullFormatted = format(now, "PPpp");
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Badge
              variant={variant}
              className={`inline-flex items-center gap-2 px-3 py-1.5 transition-all hover:scale-105 ${className}`}
            >
              {showIcon && (
                <ZapIcon
                  className={`h-3 w-3 text-primary ${animate ? "animate-pulse" : "opacity-60"}`}
                  aria-hidden="true"
                />
              )}
              <div className="flex flex-col items-start gap-0.5 leading-none">
                <span className="font-mono text-xs font-semibold tracking-tight">
                  {timeFormatted}
                </span>
                <span className="text-[10px]">
                  {dateFormatted}
                  {showTimezone && (
                    <span className="ml-1 opacity-70">
                      · {timezone.split("/").pop()}
                    </span>
                  )}
                </span>
              </div>
            </Badge>
          }
        />
        <TooltipContent side="bottom" className="font-mono text-xs">
          <div className="space-y-1">
            <div className="font-semibold">{fullFormatted}</div>
            <div className="text-[10px]">Timezone: {timezone}</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
