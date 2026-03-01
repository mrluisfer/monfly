import { Link } from "@tanstack/react-router";
import { Button } from "~/components/ui/button";
import { ChevronRight } from "lucide-react";

export const TrialAlert = () => {
  return (
    <div className="rounded-3xl border border-border/70 bg-[linear-gradient(120deg,rgba(20,184,166,0.12),rgba(59,130,246,0.08),rgba(255,255,255,0.45))] px-5 py-8 sm:px-8 sm:py-10">
      <div className="mx-auto flex max-w-4xl flex-col items-start justify-between gap-5 md:flex-row md:items-center">
        <div className="space-y-2">
          <p className="text-2xl font-semibold leading-tight sm:text-3xl">
            Start your free trial today. Your future won&apos;t wait.
          </p>
          <span className="text-sm text-muted-foreground sm:text-base">
            Join teams already using Monfly to simplify budgets and move from
            tracking to action.
          </span>
        </div>
        <Button
          size="lg"
          className="h-10 rounded-full px-5"
          render={
            <Link to="/signup" className="inline-flex items-center gap-2">
              Start your journey
              <ChevronRight className="size-4" />
            </Link>
          }
        />
      </div>
    </div>
  );
};
