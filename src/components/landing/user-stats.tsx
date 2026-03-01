import { ReactNode } from "react";
import { Clock3, DollarSign, ShieldCheck, Star } from "lucide-react";

import demoImg from "../../assets/demo.png";
import { Safari } from "../magicui/safari";

const trustStats = [
  {
    label: "App rating",
    value: "4.9",
    icon: <Star className="size-4 text-amber-500" />,
  },
  {
    label: "Support response",
    value: "< 3m",
    icon: <Clock3 className="size-4 text-cyan-600 dark:text-cyan-300" />,
  },
  {
    label: "Protected funds",
    value: "$900k",
    icon: (
      <DollarSign className="size-4 text-emerald-600 dark:text-emerald-300" />
    ),
  },
  {
    label: "Data policy",
    value: "SOC aligned",
    icon: <ShieldCheck className="size-4 text-primary" />,
  },
];

export function UserStatsSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="px-4 py-18 sm:px-6 md:py-24"
    >
      <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[minmax(0,0.42fr)_minmax(0,0.58fr)] xl:items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="inline-flex rounded-full border border-border/70 bg-background/70 px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">
              Why teams switch
            </p>
            <h2
              id="features-title"
              className="text-balance text-3xl font-semibold leading-tight sm:text-4xl"
            >
              From reactive tracking to proactive money decisions
            </h2>
            <p className="text-pretty text-muted-foreground">
              Over 200,000 users rely on Monfly to monitor spending, flag risk,
              and act faster with cleaner visibility over cashflow.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {trustStats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value}>
                {stat.icon}
              </StatCard>
            ))}
          </div>

          <div className="rounded-2xl border border-border/70 bg-background/75 p-4 text-sm text-muted-foreground">
            "Our monthly planning meeting dropped from 90 minutes to 35 because
            everyone now sees the same numbers in one place."
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-5xl">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 top-10 h-48 w-48 rounded-full bg-[radial-gradient(circle,#22c55e_0%,transparent_72%)] opacity-20 blur-2xl"
          />
          <div className="landing-glass-panel overflow-hidden rounded-[1.8rem] border border-border/70 p-3 shadow-[0_20px_60px_-35px_rgba(15,23,42,0.7)]">
            <Safari
              url="app.monfly.co"
              imageSrc={demoImg}
              className="h-auto w-full"
              role="img"
              aria-label="Monfly dashboard preview with balances, transactions, and reports."
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatCard({
  label,
  value,
  children,
}: {
  label: string;
  value: string;
  children: ReactNode;
}) {
  return (
    <article className="landing-glass-panel rounded-2xl border border-border/60 p-4 transition-colors duration-150 ease-out hover:border-primary/30">
      <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
        {children}
        {label}
      </span>
      <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
    </article>
  );
}
