import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

type SectionProps = {
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  as?: "section" | "div";
  id?: string;
};

export function Section({
  title,
  description,
  actions,
  children,
  className,
  contentClassName,
  as: Tag = "section",
  id,
}: SectionProps) {
  return (
    <Tag id={id} className={cn("space-y-3", className)}>
      {(title || actions) && (
        <header className="flex items-end justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            {title && (
              <h2 className="text-foreground text-base font-semibold tracking-tight sm:text-lg">
                {title}
              </h2>
            )}
            {description && (
              <p className="text-muted-foreground text-sm">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          )}
        </header>
      )}
      <div className={cn(contentClassName)}>{children}</div>
    </Tag>
  );
}
