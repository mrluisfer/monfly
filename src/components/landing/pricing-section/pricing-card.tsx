import { ReactNode } from "react";
import { cn } from "~/lib/utils";

type PricingCardProps = {
  title: ReactNode;
  children: ReactNode;
  className?: string;
};

export function PricingCard({ title, children, className }: PricingCardProps) {
  return (
    <article className={cn("relative h-full w-full", className)}>
      <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] bg-[linear-gradient(120deg,rgba(20,184,166,0.18),rgba(59,130,246,0.05),transparent)]" />
      <div className="landing-glass-panel relative flex h-full flex-col rounded-[1.7rem] border border-border/70 p-6 md:p-8">
        <h3 className="text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h3>
        <div className="mt-6 flex h-full flex-col">{children}</div>
      </div>
    </article>
  );
}
