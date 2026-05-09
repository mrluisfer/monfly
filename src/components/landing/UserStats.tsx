import { ReactNode } from "react";
import { Clock3, DollarSign, ShieldCheck, Star } from "lucide-react";

import demoImg from "../../assets/demo.png";
import { Safari } from "../magicui/safari";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

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

const dashboardHighlights = [
  { label: "Forecast confidence", value: "89%" },
  { label: "Real-time sync", value: "Every 12s" },
  { label: "Mobile flow", value: "One-thumb ready" },
];

export function UserStatsSection() {
  return (
    <section
      id="features"
      aria-labelledby="features-title"
      className="px-4 py-14 sm:px-6 md:py-18"
    >
      <div className="mx-auto grid max-w-6xl gap-7 xl:grid-cols-[minmax(0,0.45fr)_minmax(0,0.55fr)] xl:items-center">
        <div className="space-y-6">
          <div className="space-y-3">
            <p className="inline-flex rounded-full border border-border/75 bg-background/72 px-3 py-1 text-xs font-semibold uppercase tracking-[0.13em] text-muted-foreground">
              Why teams switch
            </p>
            <h2
              id="features-title"
              className="text-balance font-[family-name:var(--font-syne)] text-3xl font-semibold leading-[1.08] sm:text-4xl"
            >
              Replace reactive tracking with live financial direction
            </h2>
            <p className="text-pretty text-sm text-muted-foreground sm:text-base">
              More than 200,000 users rely on Monfly to monitor spending, flag
              risk, and align day-to-day actions with long-term targets.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {trustStats.map((stat) => (
              <StatCard key={stat.label} label={stat.label} value={stat.value}>
                {stat.icon}
              </StatCard>
            ))}
          </div>

          <Card>
            <CardContent>
              <p>
                "Our monthly planning meeting dropped from 90 minutes to 35
                because everyone now shares the same operating picture."
              </p>
            </CardContent>
          </Card>
        </div>

        <div
          className={`relative mx-auto w-full max-w-5xl`}
          style={{ animationDelay: "0.08s" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-6 top-10 size-48 rounded-full bg-[radial-gradient(circle,#22c55e_0%,transparent_72%)] opacity-22 blur-2xl"
          />
          <div className="relative">
            <Safari
              url="app.monfly.co"
              imageSrc={demoImg}
              className="h-auto w-full"
              role="img"
              aria-label="Monfly dashboard preview with balances, transactions, and reports."
            />
          </div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-3">
            {dashboardHighlights.map(({ label, value }) => (
              <Card key={label}>
                <CardHeader>
                  <CardTitle>
                    <p className="uppercase tracking-[0.12em] text-muted-foreground">
                      {label}
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="font-semibold text-lg">{value}</p>
                </CardContent>
              </Card>
            ))}
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
    <Card>
      <CardHeader>
        <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.12em] text-muted-foreground">
          {children}
          <CardTitle>{label}</CardTitle>
        </span>
      </CardHeader>
      <CardContent>
        <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
      </CardContent>
    </Card>
  );
}
