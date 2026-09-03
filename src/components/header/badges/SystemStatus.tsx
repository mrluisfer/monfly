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
  animate?: boolean;
  className?: string;
  compact?: boolean;
  fullWidth?: boolean;
  isActive?: boolean;
  showIcon?: boolean;
  status?: SystemStatus;
  variant?: "default" | "secondary" | "outline";
}

const statusConfig = {
  degraded: {
    color: "bg-accent",
    description: "Some systems are experiencing reduced performance.",
    icon: AlertTriangle,
    label: "Degraded Performance",
    shortLabel: "Degraded",
  },
  maintenance: {
    color: "bg-muted",
    description: "Systems are undergoing scheduled maintenance.",
    icon: Activity,
    label: "Scheduled Maintenance",
    shortLabel: "Maintenance",
  },
  operational: {
    color: "bg-primary",
    description: "All systems are running smoothly.",
    icon: CheckCircle2,
    label: "All Systems Operational",
    shortLabel: "Operational",
  },
  outage: {
    color: "bg-destructive",
    description: "Critical systems are experiencing issues.",
    icon: XCircle,
    label: "Major Outage",
    shortLabel: "Outage",
  },
  partial: {
    color: "bg-secondary",
    description: "Some systems are currently unavailable.",
    icon: AlertCircle,
    label: "Partial Outage",
    shortLabel: "Partial Outage",
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
            <span className="font-semibold text-xs">{config.label}</span>
          </div>
          <p className="text-[10px]">{config.description}</p>
        </div>
      }
    >
      <StatusDot
        color={config.color}
        animate={animate && status === "operational"}
      />

      {showIcon ? (
        <BadgeIcon
          icon={config.icon}
          className="opacity-75"
          fullWidth={fullWidth}
        />
      ) : null}

      <span
        className={cn(
          "min-w-0 truncate font-medium text-xs",
          fullWidth && "flex-1",
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
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          render={
            <button
              type="button"
              className={cn(
                "relative inline-flex size-3 cursor-pointer rounded-full transition-transform hover:scale-125",
                config.color,
                className,
              )}
              aria-label={config.label}
            >
              {status === "operational" && (
                <span
                  className={cn(
                    "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                    config.color,
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
