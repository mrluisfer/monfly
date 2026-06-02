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
    icon: <ShieldCheck className="text-primary size-4" />,
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
            <p className="border-border/75 bg-background/72 text-muted-foreground inline-flex rounded-full border px-3 py-1 text-xs font-semibold tracking-[0.13em] uppercase">
              Why teams switch
            </p>
            <h2
              id="features-title"
              className="font-[family-name:var(--font-syne)] text-3xl leading-[1.08] font-semibold text-balance sm:text-4xl"
            >
              Replace reactive tracking with live financial direction
            </h2>
            <p className="text-muted-foreground text-sm text-pretty sm:text-base">
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
                &ldquo;Our monthly planning meeting dropped from 90 minutes to
                35 because everyone now shares the same operating
                picture.&rdquo;
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
            className="pointer-events-none absolute top-10 -right-6 size-48 rounded-full bg-[radial-gradient(circle,#22c55e_0%,transparent_72%)] opacity-22 blur-2xl"
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
                    <p className="text-muted-foreground tracking-[0.12em] uppercase">
                      {label}
                    </p>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-lg font-semibold">{value}</p>
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
        <span className="text-muted-foreground inline-flex items-center gap-2 text-xs tracking-[0.12em] uppercase">
          {children}
          <CardTitle>{label}</CardTitle>
        </span>
      </CardHeader>
      <CardContent>
        <p className="text-foreground mt-2 text-xl font-semibold">{value}</p>
      </CardContent>
    </Card>
  );
}
