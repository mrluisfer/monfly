import {
  Activity,
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

import { BadgeIcon, HeaderBadge, StatusDot } from "./HeaderBadge";

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
  compact?: boolean;
  fullWidth?: boolean;
  isActive?: boolean;
  variant?: "default" | "secondary" | "outline";
  className?: string;
}

const statusConfig = {
  operational: {
    label: "All Systems Operational",
    shortLabel: "Operational",
    color: "bg-primary",
    icon: CheckCircle2,
    description: "All systems are running smoothly.",
  },
  degraded: {
    label: "Degraded Performance",
    shortLabel: "Degraded",
    color: "bg-accent",
    icon: AlertTriangle,
    description: "Some systems are experiencing reduced performance.",
  },
  partial: {
    label: "Partial Outage",
    shortLabel: "Partial Outage",
    color: "bg-secondary",
    icon: AlertCircle,
    description: "Some systems are currently unavailable.",
  },
  outage: {
    label: "Major Outage",
    shortLabel: "Outage",
    color: "bg-destructive",
    icon: XCircle,
    description: "Critical systems are experiencing issues.",
  },
  maintenance: {
    label: "Scheduled Maintenance",
    shortLabel: "Maintenance",
    color: "bg-muted",
    icon: Activity,
    description: "Systems are undergoing scheduled maintenance.",
  },
} as const;

export function SystemStatusBadge({
  status = "operational",
  showIcon = true,
  animate = true,
  compact = false,
  fullWidth = false,
  isActive = true,
  variant = "outline",
  className = "",
}: SystemStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <HeaderBadge
      variant={variant}
      compact={compact}
      fullWidth={fullWidth}
      isActive={isActive}
      className={className}
      tooltipContent={
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
            <span className="text-xs font-semibold">{config.label}</span>
          </div>
          <p className="text-[10px]">{config.description}</p>
        </div>
      }
    >
      <StatusDot
        color={config.color}
        animate={animate && status === "operational"}
      />

      {showIcon && (
        <BadgeIcon
          icon={config.icon}
          className="opacity-75"
          fullWidth={fullWidth}
        />
      )}

      <span
        className={cn(
          "min-w-0 truncate text-xs font-medium",
          fullWidth && "flex-1"
        )}
      >
        {compact ? config.shortLabel : config.label}
      </span>
    </HeaderBadge>
  );
}

export function SystemStatusBadgeCompact({
  status = "operational",
  className = "",
}: Pick<SystemStatusBadgeProps, "status" | "className">) {
  const config = statusConfig[status];

  return (
    <TooltipProvider >
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              className={cn(
                "relative inline-flex size-3 cursor-pointer rounded-full transition-transform hover:scale-125",
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
          }
        />

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
