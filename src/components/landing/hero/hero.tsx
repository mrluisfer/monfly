import { Link } from "@tanstack/react-router";
import { domAnimation, LazyMotion, m, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  CheckCheck,
  CircleAlert,
  MoveUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Button } from "../../ui/button";

const miniMetrics = [
  { label: "Mobile retention", value: "93%" },
  { label: "Plans reviewed", value: "1.2M+" },
  { label: "Avg. savings delta", value: "+31%" },
];

const decisionFeed = [
  {
    title: "Overspending alert",
    description: "Food spend is 18% above baseline this week.",
    icon: CircleAlert,
    tone: "text-amber-600 dark:text-amber-300",
  },
  {
    title: "Bill forecast updated",
    description: "Expected fixed costs for next month: $1,945.",
    icon: MoveUpRight,
    tone: "text-teal-600 dark:text-teal-300",
  },
  {
    title: "Goal progress locked",
    description: "Emergency fund target reached 74% this quarter.",
    icon: CheckCheck,
    tone: "text-emerald-600 dark:text-emerald-300",
  },
];

export function LandingHero() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <section
      id="getting-started"
      aria-labelledby="hero-title"
      className="relative px-4 pb-14 pt-11 sm:px-6 md:pb-16 md:pt-16"
    >
      <LazyMotion features={domAnimation}>
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-start lg:gap-9">
          <m.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5 }}
            className="space-y-7"
          >
            <p className="inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/8 px-3.5 py-1.5 text-xs font-semibold uppercase tracking-[0.12em] text-primary">
              <Sparkles className="size-3.5" />
              Decision-first finance
            </p>

            <div className="space-y-4">
              <h1
                id="hero-title"
                className="text-balance font-[family-name:var(--font-syne)] text-[2.1rem] leading-[1.02] font-bold tracking-tight text-foreground sm:text-[2.85rem] md:text-[3.4rem]"
              >
                A money cockpit
                <span className="landing-gradient-text block">
                  built for mobile speed
                </span>
              </h1>
              <p className="max-w-xl text-pretty text-sm text-muted-foreground sm:text-base md:text-lg">
                Monfly converts raw transactions into decisions you can act on
                in seconds. Budget pressure, cashflow risks, and plan changes
                are visible before they become expensive.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
              <Button
                size="lg"
                className="h-11 rounded-full px-5"
                render={
                  <Link to="/signup" className="inline-flex items-center gap-2">
                    Start For Free
                    <ArrowRight className="size-4" />
                  </Link>
                }
              />
              <Button
                size="lg"
                variant="outline"
                className="h-11 rounded-full border-border/75 bg-background/65 px-5"
                render={<Link to="/login">Open existing workspace</Link>}
              />
            </div>

            <dl className="grid gap-2.5 sm:grid-cols-3">
              {miniMetrics.map((metric, index) => (
                <m.div
                  key={metric.label}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: shouldReduceMotion ? 0 : 0.36,
                    delay: shouldReduceMotion ? 0 : index * 0.08 + 0.08,
                  }}
                  className="landing-glass-panel rounded-2xl border border-border/65 p-3.5"
                >
                  <dt className="text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground">
                    {metric.label}
                  </dt>
                  <dd className="mt-1 text-xl font-semibold text-foreground">
                    {metric.value}
                  </dd>
                </m.div>
              ))}
            </dl>
          </m.div>

          <m.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.5, delay: 0.1 }}
            className="relative mx-auto w-full max-w-xl space-y-3"
          >
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -left-8 top-14 h-40 w-40 rounded-full bg-[radial-gradient(circle,#14b8a6_0%,transparent_72%)] opacity-32 blur-2xl"
            />
            <article className="landing-glass-panel relative rounded-[1.7rem] border border-border/65 p-5 sm:p-6">
              <div className="mb-5 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                  Live Decision Feed
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[0.72rem] font-semibold text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="size-3.5" />
                  Encrypted
                </span>
              </div>

              <div className="rounded-2xl border border-border/65 bg-background/80 p-4">
                <p className="text-xs uppercase tracking-[0.12em] text-muted-foreground">
                  Available Cash
                </p>
                <p className="mt-2 font-[family-name:var(--font-sora)] text-3xl font-semibold text-foreground">
                  $82,490
                </p>
                <p className="mt-1 text-xs text-emerald-700 dark:text-emerald-300">
                  +8.2% versus last month
                </p>
              </div>

              <ul className="mt-4 space-y-2.5">
                {decisionFeed.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-xl border border-border/60 bg-background/72 px-3 py-2.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <item.icon className={`mt-0.5 size-4 ${item.tone}`} />
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          {item.title}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.description}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </article>

            <figure className="landing-glass-panel rounded-2xl border border-border/65 bg-background/84 px-4 py-3 text-sm shadow-sm">
              <blockquote>
                "We replaced three dashboards and two spreadsheets with one
                decision stream."
              </blockquote>
              <figcaption className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-primary">
                Finance Ops, Salt Studio
              </figcaption>
            </figure>
          </m.div>
        </div>
      </LazyMotion>
    </section>
  );
}
