import { CalendarDaysIcon } from "lucide-react";
import { type ReactNode, useMemo } from "react";

import { Badge } from "../ui/badge";

export function WelcomeMessage({ children }: { children: ReactNode }) {
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        day: "numeric",
        month: "long",
        weekday: "long",
      }).format(new Date()),
    [],
  );

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <h1 className="font-semibold text-2xl text-foreground tracking-tight sm:text-3xl">
          Overview
        </h1>
        <p className="max-w-3xl text-muted-foreground text-sm leading-6">
          {children}
        </p>
      </div>

      <Badge>
        <CalendarDaysIcon />
        {todayLabel}
      </Badge>
    </header>
  );
}
