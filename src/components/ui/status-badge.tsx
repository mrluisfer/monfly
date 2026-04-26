import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "~/lib/utils";

const statusBadgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        success:
          "border-success/20 bg-success/10 text-success [&>[data-dot]]:bg-success",
        warning:
          "border-warning/30 bg-warning/15 text-warning-foreground dark:text-warning [&>[data-dot]]:bg-warning",
        info:
          "border-info/20 bg-info/10 text-info [&>[data-dot]]:bg-info",
        danger:
          "border-destructive/20 bg-destructive/10 text-destructive [&>[data-dot]]:bg-destructive",
        neutral:
          "border-border bg-muted text-muted-foreground [&>[data-dot]]:bg-muted-foreground",
        primary:
          "border-primary/20 bg-primary/10 text-primary [&>[data-dot]]:bg-primary",
      },
      size: {
        sm: "h-5 px-2 text-[11px]",
        md: "h-6 px-2.5 text-xs",
        lg: "h-7 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "neutral",
      size: "md",
    },
  }
);

type StatusBadgeProps = React.HTMLAttributes<HTMLSpanElement> &
  VariantProps<typeof statusBadgeVariants> & {
    dot?: boolean;
    pulse?: boolean;
    icon?: React.ReactNode;
  };

export function StatusBadge({
  className,
  variant,
  size,
  dot = false,
  pulse = false,
  icon,
  children,
  ...props
}: StatusBadgeProps) {
  return (
    <span
      className={cn(statusBadgeVariants({ variant, size }), className)}
      {...props}
    >
      {dot && (
        <span className="relative flex size-1.5 shrink-0">
          {pulse && (
            <span
              data-dot
              aria-hidden="true"
              className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-60"
            />
          )}
          <span
            data-dot
            aria-hidden="true"
            className="relative inline-flex size-1.5 rounded-full"
          />
        </span>
      )}
      {icon && (
        <span aria-hidden="true" className="flex shrink-0 [&>svg]:size-3">
          {icon}
        </span>
      )}
      {children}
    </span>
  );
}

export { statusBadgeVariants };
