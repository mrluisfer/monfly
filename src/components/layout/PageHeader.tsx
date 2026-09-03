import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface PageHeaderProps {
  actions?: ReactNode;
  className?: string;
  description?: ReactNode | string;
  icon?: ReactNode;
  title: ReactNode;
}

export function PageHeader({
  title,
  description,
  icon,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col flex-wrap gap-3 pb-2 sm:flex-row sm:items-end sm:justify-between sm:gap-6 lg:flex-nowrap",
        className,
      )}
    >
      <div className="flex min-w-0 flex-wrap items-start gap-3 lg:flex-nowrap">
        {icon ? (
          <div
            aria-hidden="true"
            className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/10 text-primary"
          >
            {icon}
          </div>
        ) : null}
        <div className="min-w-0 space-y-1">
          <h1 className="truncate font-semibold text-foreground text-xl tracking-tight">
            {title}
          </h1>
          {description ? (
            <p className="max-w-xs truncate text-ellipsis text-muted-foreground text-sm leading-relaxed sm:max-w-sm sm:text-base md:max-w-md lg:max-w-lg xl:max-w-7xl">
              {description}
            </p>
          ) : null}
        </div>
      </div>
      {actions ? (
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          {actions}
        </div>
      ) : null}
    </div>
  );
}
