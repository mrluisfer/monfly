import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ChartNoAxesCombined,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "../../ui/button";

const miniMetrics = [
  { label: "Accounts synced", value: "18K+" },
  { label: "Live alerts sent", value: "1.2M" },
  { label: "Avg. save increase", value: "+31%" },
];

const snapshotHighlights = [
  "Autocategorized transactions in real time",
  "Custom dashboards for budget and goals",
  "Bank-level security with audit-friendly records",
];

export function LandingHero() {
  return (
    <section
      id="getting-started"
      aria-labelledby="hero-title"
      className="relative px-4 pb-16 pt-14 sm:px-6 md:pt-20"
    >
      <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[1.07fr_0.93fr] lg:items-start lg:gap-10">
        <div className="space-y-8">
          <p className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/6 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
            <Sparkles className="size-3.5" />
            Modern Money OS
          </p>

          <div className="space-y-5">
            <h1
              id="hero-title"
              className="text-balance text-4xl font-bold leading-tight sm:text-5xl md:text-6xl"
            >
              Financial control that feels
              <span className="landing-gradient-text block"> intentional</span>
            </h1>
            <p className="max-w-xl text-pretty text-base text-muted-foreground sm:text-lg">
              Monfly turns scattered transactions into a clear operating system
              for your money. Track spending, forecast cashflow, and move faster
              with insight-backed decisions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Button
              size="lg"
              className="h-11 rounded-full px-5 shadow-[0_16px_30px_-20px_rgba(14,116,144,0.55)]"
              render={
                <Link to="/signup" className="inline-flex items-center gap-2">
                  Launch My Workspace
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
            <Button
              size="lg"
              variant="outline"
              className="h-11 rounded-full border-border/70 px-5"
              render={<Link to="/login">I already have an account</Link>}
            />
          </div>

          <dl className="grid gap-3 sm:grid-cols-3">
            {miniMetrics.map((metric) => (
              <div
                key={metric.label}
                className="landing-glass-panel rounded-2xl border border-border/60 p-3"
              >
                <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                  {metric.label}
                </dt>
                <dd className="mt-1 text-xl font-semibold text-foreground">
                  {metric.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-xl space-y-3">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-8 top-10 h-40 w-40 rounded-full bg-[radial-gradient(circle,#14b8a6_0%,transparent_72%)] opacity-35 blur-2xl"
          />
          <article className="landing-glass-panel relative rounded-[1.8rem] border border-border/60 p-6 sm:p-7">
            <div className="mb-6 flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                Realtime Snapshot
              </p>
              <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-xs font-medium text-emerald-600 dark:text-emerald-300">
                <ShieldCheck className="size-3.5" />
                Protected
              </span>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Total Balance
                </p>
                <p className="mt-2 text-3xl font-semibold text-foreground">
                  $82,490
                </p>
                <p className="mt-1 text-xs text-emerald-600 dark:text-emerald-300">
                  +8.2% vs last month
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <p className="text-xs text-muted-foreground">Spent</p>
                  <p className="mt-1 text-lg font-semibold">$2,430</p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/80 p-4">
                  <p className="text-xs text-muted-foreground">Saved</p>
                  <p className="mt-1 text-lg font-semibold">$1,210</p>
                </div>
              </div>

              <ul className="space-y-2">
                {snapshotHighlights.map((point) => (
                  <li
                    key={point}
                    className="flex items-start gap-2 text-sm text-muted-foreground"
                  >
                    <ChartNoAxesCombined className="mt-0.5 size-4 text-primary" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </article>

          <figure className="landing-glass-panel rounded-2xl border border-border/60 bg-background/85 px-4 py-3 text-sm shadow-sm">
            <blockquote>
              "Monfly gave us a cleaner money workflow in two weeks."
            </blockquote>
            <figcaption className="mt-1 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
              Ops Team, Arc Studio
            </figcaption>
          </figure>
        </div>
      </div>
    </section>
  );
}
