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
      <div className="pointer-events-none absolute inset-0 rounded-[1.7rem] bg-[linear-gradient(135deg,rgba(13,148,136,0.2),rgba(251,146,60,0.08),transparent)]" />
      <div className="landing-glass-panel relative flex h-full flex-col rounded-[1.7rem] border border-border/70 p-5 md:p-7">
        <h3 className="font-[family-name:var(--font-sora)] text-4xl font-semibold tracking-tight md:text-5xl">
          {title}
        </h3>
        <div className="mt-5 flex h-full flex-col">{children}</div>
      </div>
    </article>
  );
}
