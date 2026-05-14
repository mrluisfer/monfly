import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

type PageHeaderProps = {
  title: ReactNode;
  description?: ReactNode;
  icon?: ReactNode;
  actions?: ReactNode;
  className?: string;
};

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
        {icon && (
          <div
            aria-hidden="true"
            className="bg-primary/10 text-primary border-primary/15 flex size-10 shrink-0 items-center justify-center rounded-xl border"
          >
            {icon}
          </div>
        )}
        <div className="min-w-0 space-y-1">
          <h1 className="text-foreground truncate text-xl font-semibold tracking-tight">
            {title}
          </h1>
          {description && (
            <p className="text-muted-foreground max-w-xs truncate text-sm leading-relaxed text-ellipsis sm:max-w-sm sm:text-base md:max-w-md lg:max-w-lg xl:max-w-7xl">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:shrink-0">
          {actions}
        </div>
      )}
    </div>
  );
}
