import { Link } from "@tanstack/react-router";
import {
  CheckCheck,
  ChevronRightIcon,
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
    description: "Food spend is 18% above baseline this week.",
    icon: CircleAlert,
    title: "Overspending alert",
    tone: "text-amber-600 dark:text-amber-300",
  },
  {
    description: "Expected fixed costs for next month: $1,945.",
    icon: MoveUpRight,
    title: "Bill forecast updated",
    tone: "text-teal-600 dark:text-teal-300",
  },
  {
    description: "Emergency fund target reached 74% this quarter.",
    icon: CheckCheck,
    title: "Goal progress locked",
    tone: "text-emerald-600 dark:text-emerald-300",
  },
];

export function LandingHero() {
  return (
    <section
      id="getting-started"
      aria-labelledby="hero-title"
      className="relative px-4 pt-11 pb-14 sm:px-6 md:pt-16 md:pb-16"
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
              className="text-balance font-[family-name:var(--font-syne)] font-bold text-[2.1rem] text-foreground leading-[1.02] tracking-tight sm:text-[2.85rem] md:text-[3.4rem]"
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
                  <ChevronRightIcon />
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
                <dt className="text-[0.68rem] text-muted-foreground uppercase tracking-[0.12em]">
                  {metric.label}
                </dt>
                <dd className="mt-1 font-semibold text-foreground text-xl">
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
            className="pointer-events-none absolute top-14 -left-8 size-40 rounded-full bg-[radial-gradient(circle,#14b8a6_0%,transparent_72%)] opacity-32 blur-2xl"
          />
          <Card>
            <CardContent>
              <div className="mb-5 flex items-center justify-between gap-2">
                <p className="font-semibold text-muted-foreground text-xs uppercase tracking-[0.13em]">
                  Live Decision Feed
                </p>
                <span className="inline-flex items-center gap-1 rounded-md bg-emerald-500/10 px-2 py-1 font-semibold text-[0.72rem] text-emerald-700 dark:text-emerald-300">
                  <ShieldCheck className="size-3.5" />
                  Encrypted
                </span>
              </div>

              <div className="rounded-md border border-border/65 bg-background/80 p-4">
                <p className="text-muted-foreground text-xs uppercase tracking-[0.12em]">
                  Available Cash
                </p>
                <p className="mt-2 font-[family-name:var(--font-sora)] font-semibold text-3xl text-foreground">
                  $82,490
                </p>
                <p className="mt-1 text-emerald-700 text-xs dark:text-emerald-300">
                  +8.2% versus last month
                </p>
              </div>

              <ul className="mt-4 space-y-2.5">
                {decisionFeed.map((item) => (
                  <li
                    key={item.title}
                    className="rounded-md border border-border/60 bg-background/72 px-3 py-2.5"
                  >
                    <div className="flex items-start gap-2.5 lg:items-center">
                      <item.icon className={`mt-0.5 size-4 ${item.tone}`} />
                      <div>
                        <p className="font-semibold text-foreground text-sm">
                          {item.title}
                        </p>
                        <p className="text-muted-foreground text-xs">
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
                <blockquote className="text-foreground italic leading-relaxed tracking-wide">
                  &ldquo;We replaced three dashboards and two spreadsheets with
                  one decision stream.&rdquo;
                </blockquote>
                <figcaption className="mt-1 font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.12em]">
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
