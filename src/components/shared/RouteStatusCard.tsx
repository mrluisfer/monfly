import type { ReactNode } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card";

interface RouteStatusCardProps {
  actions: ReactNode;
  description: ReactNode;
  details?: ReactNode;
  icon: ReactNode;
  title: string;
}

export function RouteStatusCard({
  icon,
  title,
  description,
  actions,
  details,
}: RouteStatusCardProps) {
  return (
    <main
      className="flex min-h-[60vh] items-center justify-center px-4 py-10"
      role="alert"
    >
      <Card className="w-full max-w-xl border-border/70 bg-background/95 shadow-xl backdrop-blur-sm">
        <CardHeader className="items-center text-center">
          <div className="mb-2 flex size-14 items-center justify-center rounded-full bg-muted text-muted-foreground">
            {icon}
          </div>
          <CardTitle className="font-semibold text-2xl tracking-tight md:text-3xl">
            {title}
          </CardTitle>
          <CardDescription className="mx-auto max-w-md text-base">
            {description}
          </CardDescription>
        </CardHeader>
        {details ? <CardContent>{details}</CardContent> : null}
        <CardFooter className="flex flex-wrap items-center justify-center gap-3">
          {actions}
        </CardFooter>
      </Card>
    </main>
  );
}
