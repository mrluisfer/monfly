import type { ReactNode } from "react";
import { cn } from "~/lib/utils";

interface SectionProps {
  actions?: ReactNode;
  as?: "section" | "div";
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  description?: ReactNode;
  id?: string;
  title?: ReactNode;
}

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
      {title || actions ? (
        <header className="flex items-end justify-between gap-3">
          <div className="min-w-0 space-y-0.5">
            {title ? (
              <h2 className="font-semibold text-base text-foreground tracking-tight sm:text-lg">
                {title}
              </h2>
            ) : null}
            {description ? (
              <p className="text-muted-foreground text-sm">{description}</p>
            ) : null}
          </div>
          {actions ? (
            <div className="flex shrink-0 items-center gap-2">{actions}</div>
          ) : null}
        </header>
      ) : null}
      <div className={cn(contentClassName)}>{children}</div>
    </Tag>
  );
}
