import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";
import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";

type SystemStatus =
  | "operational"
  | "degraded"
  | "partial"
  | "outage"
  | "maintenance";

interface SystemStatusBadgeProps {
  status?: SystemStatus;
  showIcon?: boolean;
  animate?: boolean;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

const statusConfig = {
  operational: {
    label: "All Systems Operational",
    shortLabel: "Operational",
    color: "bg-emerald-500",
    icon: CheckCircle2,
    description: "All systems are running smoothly.",
  },
  degraded: {
    label: "Degraded Performance",
    shortLabel: "Degraded",
    color: "bg-amber-500",
    icon: AlertTriangle,
    description: "Some systems are experiencing reduced performance.",
  },
  partial: {
    label: "Partial Outage",
    shortLabel: "Partial Outage",
    color: "bg-orange-500",
    icon: AlertCircle,
    description: "Some systems are currently unavailable.",
  },
  outage: {
    label: "Major Outage",
    shortLabel: "Outage",
    color: "bg-red-500",
    icon: XCircle,
    description: "Critical systems are experiencing issues.",
  },
  maintenance: {
    label: "Scheduled Maintenance",
    shortLabel: "Maintenance",
    color: "bg-blue-500",
    icon: Activity,
    description: "Systems are undergoing scheduled maintenance.",
  },
} as const;

export function SystemStatusBadge({
  status = "operational",
  showIcon = true,
  animate = true,
  variant = "secondary",
  className = "",
}: SystemStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Badge
            variant={variant}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-1.5 uppercase tracking-wide select-none transition-all hover:scale-105",
              className
            )}
          >
            <span
              className={cn("relative flex h-2 w-2 rounded-full", config.color)}
              aria-hidden="true"
            >
              {animate && status === "operational" && (
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

            <span className="text-xs font-medium">{config.shortLabel}</span>
          </Badge>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
              <span className="font-semibold text-xs">{config.label}</span>
            </div>
            <p className="text-[10px]">{config.description}</p>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

// ============================================================
// Variant: Compact version with just the dot
// ============================================================

export function SystemStatusBadgeCompact({
  status = "operational",
  className = "",
}: Pick<SystemStatusBadgeProps, "status" | "className">) {
  const config = statusConfig[status];

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <button
            className={cn(
              "relative inline-flex h-3 w-3 cursor-pointer rounded-full transition-transform hover:scale-125",
              config.color,
              className
            )}
            aria-label={config.label}
          >
            {status === "operational" && (
              <span
                className={cn(
                  "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                  config.color
                )}
              />
            )}
          </button>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="text-xs">
          <div className="flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
            {config.label}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
