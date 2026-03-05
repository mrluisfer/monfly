import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";

export const TrialAlert = () => {
  return (
    <div className="rounded-3xl border border-border/75 bg-[linear-gradient(124deg,rgba(13,148,136,0.16),rgba(251,146,60,0.11),rgba(255,255,255,0.42))] px-5 py-7 sm:px-8 sm:py-9">
      <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <div className="space-y-2">
          <p className="font-[family-name:var(--font-syne)] text-2xl font-semibold leading-tight sm:text-3xl">
            Start your free trial now and run money like an operating system.
          </p>
          <span className="text-sm text-foreground/80 sm:text-base">
            Join teams already using Monfly to simplify budgets and move from
            tracking to action.
          </span>
        </div>
        <Button
          size="lg"
          className="h-10 rounded-full px-5"
          render={
            <Link to="/signup" className="inline-flex items-center gap-2">
              Launch your workspace
              <ChevronRight className="size-4" />
            </Link>
          }
        />
      </div>
    </div>
  );
};
