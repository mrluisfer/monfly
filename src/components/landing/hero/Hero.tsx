import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCheck,
  CircleAlert,
  MoveUpRight,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

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
  return (
    <section
      id="getting-started"
      aria-labelledby="hero-title"
      className="relative px-4 pb-14 pt-11 sm:px-6 md:pb-16 md:pt-16"
    >
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.06fr_0.94fr] lg:items-start lg:gap-9">
        <div className="landing-fade-up space-y-7">
          <Badge variant={"default"}>
            <Sparkles className="size-3.5" />
            Decision-first finance
          </Badge>

          <div className="space-y-4">
            <h1
              id="hero-title"
              className="text-balance font-[family-name:var(--font-syne)] text-[2.1rem] leading-[1.02] font-bold tracking-tight text-foreground sm:text-[2.85rem] md:text-[3.4rem]"
            >
              See your money clearly
              <span className="landing-gradient-text block">
                act on it instantly
              </span>
            </h1>
            <p className="max-w-xl text-pretty text-sm sm:text-base md:text-lg">
              Monfly converts raw transactions into decisions you can act on in
              seconds. Budget pressure, cashflow risks, and plan changes are
              visible before they become expensive.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            <Button
              size="lg"
              render={
                <Link to="/signup">
                  Start For Free
                  <ArrowRight className="size-4" />
                </Link>
              }
            />
            <Button
              size="lg"
              variant="secondary"
              render={<Link to="/home">Open existing workspace</Link>}
            />
          </div>

          <dl className="grid gap-2.5 sm:grid-cols-3">
            {miniMetrics.map((metric, index) => (
              <div
                key={metric.label}
                className="landing-fade-up landing-glass-panel rounded-2xl border border-border/65 p-3.5"
                style={{ animationDelay: `${index * 0.08 + 0.08}s` }}
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

        <div
          className="landing-fade-up relative mx-auto w-full max-w-xl space-y-3"
          style={{ animationDelay: "0.1s" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-8 top-14 h-40 w-40 rounded-full bg-[radial-gradient(circle,#14b8a6_0%,transparent_72%)] opacity-32 blur-2xl"
          />
          <Card>
            <CardContent>
              <div className="mb-5 flex items-center justify-between gap-2">
                <p className="text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">
                  Live Decision Feed
                </p>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[0.72rem] font-semibold text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="size-3.5" />
                  Encrypted
                </span>
              </div>

              <div className="rounded-4xl border border-border/65 bg-background/80 p-4">
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
                    className="rounded-4xl border border-border/60 bg-background/72 px-3 py-2.5"
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
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <figure>
                <blockquote className="italic text-foreground leading-relaxed tracking-wide">
                  "We replaced three dashboards and two spreadsheets with one
                  decision stream."
                </blockquote>
                <figcaption className="mt-1 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                  Finance Ops, Salt Studio
                </figcaption>
              </figure>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
