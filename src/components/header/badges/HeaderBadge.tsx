import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

export interface HeaderBadgeProps {
  ariaLive?: "polite" | "assertive" | "off";
  children: ReactNode;
  className?: string;
  compact?: boolean;
  fullWidth?: boolean;
  isActive?: boolean;
  tooltipClassName?: string;
  tooltipContent: ReactNode;
  tooltipSide?: "top" | "bottom" | "left" | "right";
  variant?: "default" | "secondary" | "outline" | "destructive";
}

export function HeaderBadge({
  variant = "outline",
  compact = false,
  fullWidth = false,
  isActive = true,
  className,
  tooltipContent,
  tooltipSide = "bottom",
  tooltipClassName,
  ariaLive,
  children,
}: HeaderBadgeProps) {
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
                "inline-flex min-w-0 max-w-full select-none items-center gap-2 border border-border/70 bg-card px-3 py-1.5 text-foreground shadow-xs backdrop-blur-[2px] transition-colors duration-200 hover:bg-muted/70",
                fullWidth && "h-10 w-full rounded-xl px-3.5 py-2",
                compact && "h-8 px-2.5 py-1",
                !(compact || fullWidth) && "h-9",
                className,
              )}
              aria-live={ariaLive}
            >
              {children}
            </Badge>
          }
        />

        <TooltipContent
          side={tooltipSide}
          className={cn("max-w-sm", tooltipClassName)}
        >
          {tooltipContent}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export interface StatusDotProps {
  animate?: boolean;
  color: string;
}

export function StatusDot({ color, animate = false }: StatusDotProps) {
  return (
    <span
      className={cn("relative inline-flex size-2 rounded-full", color)}
      aria-hidden="true"
    >
      {animate ? (
        <span
          className={cn(
            "absolute inline-flex size-full animate-ping rounded-full opacity-75",
            color,
          )}
        />
      ) : null}
    </span>
  );
}

export interface BadgeIconProps {
  animate?: boolean;
  className?: string;
  fullWidth?: boolean;
  icon: LucideIcon;
}

export function BadgeIcon({
  icon: Icon,
  className,
  fullWidth = false,
  animate = false,
}: BadgeIconProps) {
  return (
    <Icon
      className={cn(
        "size-3.5 shrink-0",
        fullWidth && "size-4",
        animate && "animate-spin",
        className,
      )}
      aria-hidden="true"
    />
  );
}
