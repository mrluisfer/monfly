import { ReactNode, useMemo } from "react";
import { CalendarDaysIcon } from "lucide-react";

export function WelcomeMessage({ children }: { children: ReactNode }) {
  const todayLabel = useMemo(
    () =>
      new Intl.DateTimeFormat("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      }).format(new Date()),
    []
  );

  return (
    <header className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div className="space-y-1.5">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          Overview
        </h1>
        <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
          {children}
        </p>
      </div>

      <p className="inline-flex items-center gap-2 text-sm text-muted-foreground">
        <CalendarDaysIcon className="size-4" />
        {todayLabel}
      </p>
    </header>
  );
}
