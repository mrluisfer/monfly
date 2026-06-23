import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { DataNotFoundPlaceholder } from "~/components/shared/DataNotFoundPlaceholder";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useActiveCard } from "~/hooks/cards";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getDailyActivityServer } from "~/lib/api/chart/get-daily-activity";
import { cn } from "~/lib/utils";
import {
  formatCurrency,
  type SupportedCurrency,
} from "~/utils/format-currency";
import { queryKeys } from "~/utils/query-keys";
import type { DailyActivityRow } from "~/server/db/charts/get-daily-activity";
import { FlameIcon } from "lucide-react";

import Card from "../shared/Card";
import { ChartError, ChartLoading } from "./ChartLoading";

const WEEKS_TO_SHOW = 13;
const DAY_MS = 24 * 60 * 60 * 1000;

type DayCell = {
  /** YYYY-MM-DD, or null for leading pad cells before the window starts. */
  date: string | null;
  label: string;
  income: number;
  expense: number;
  count: number;
  /** 0 = no activity, 1–4 = |net| intensity quartile. */
  level: 0 | 1 | 2 | 3 | 4;
  /** Whether the day netted positive (income ≥ expense). */
  positive: boolean;
};

// Net-positive days tint primary, net-negative days tint destructive, so the
// graph reads cash direction at a glance — not just activity volume.
const POSITIVE_LEVELS = [
  "bg-muted",
  "bg-primary/25",
  "bg-primary/45",
  "bg-primary/70",
  "bg-primary",
] as const;
const NEGATIVE_LEVELS = [
  "bg-muted",
  "bg-destructive/25",
  "bg-destructive/45",
  "bg-destructive/70",
  "bg-destructive",
] as const;

function utcToday(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function buildCalendar(rows: DailyActivityRow[]) {
  const byDate = new Map(rows.map((row) => [row.date, row]));

  const today = utcToday();
  // Last cell is today; first column starts on the Sunday of the earliest week.
  const windowStart = new Date(
    today.getTime() - (WEEKS_TO_SHOW * 7 - 1) * DAY_MS,
  );
  const gridStart = new Date(
    windowStart.getTime() - windowStart.getUTCDay() * DAY_MS,
  );

  const maxAbsNet = Math.max(
    1,
    ...rows.map((row) => Math.abs(row.income - row.expense)),
  );

  const weeks: DayCell[][] = [];
  const monthLabels: { weekIndex: number; label: string }[] = [];
  let lastMonth = -1;

  for (let day = new Date(gridStart); day <= today; ) {
    const weekIndex = Math.floor(
      (day.getTime() - gridStart.getTime()) / (7 * DAY_MS),
    );
    if (!weeks[weekIndex]) {
      weeks[weekIndex] = [];
      const month = day.getUTCMonth();
      if (month !== lastMonth) {
        monthLabels.push({
          weekIndex,
          label: day.toLocaleString("en-US", {
            month: "short",
            timeZone: "UTC",
          }),
        });
        lastMonth = month;
      }
    }

    if (day < windowStart) {
      weeks[weekIndex].push({
        date: null,
        label: "",
        income: 0,
        expense: 0,
        count: 0,
        level: 0,
        positive: true,
      });
    } else {
      const iso = day.toISOString().slice(0, 10);
      const row = byDate.get(iso);
      const income = row?.income ?? 0;
      const expense = row?.expense ?? 0;
      const count = row?.count ?? 0;
      const net = income - expense;
      const level: DayCell["level"] =
        count === 0
          ? 0
          : ((Math.min(4, Math.ceil((Math.abs(net) / maxAbsNet) * 4)) ||
              1) as DayCell["level"]);

      weeks[weekIndex].push({
        date: iso,
        label: day.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        }),
        income,
        expense,
        count,
        level,
        positive: net >= 0,
      });
    }

    day = new Date(day.getTime() + DAY_MS);
  }

  return { weeks, monthLabels };
}

function summarize(rows: DailyActivityRow[]) {
  let activeDays = 0;
  let busiest: DailyActivityRow | null = null;
  for (const row of rows) {
    if (row.count > 0) activeDays += 1;
    if (!busiest || row.expense > busiest.expense) busiest = row;
  }
  return {
    activeDays,
    busiest: busiest && busiest.expense > 0 ? busiest : null,
  };
}

function HeatmapCell({
  cell,
  currency,
}: {
  cell: DayCell;
  currency: SupportedCurrency;
}) {
  if (!cell.date) {
    return <div aria-hidden="true" className="size-3.5 rounded-[3px]" />;
  }

  const palette = cell.positive ? POSITIVE_LEVELS : NEGATIVE_LEVELS;
  const net = cell.income - cell.expense;

  return (
    <Tooltip>
      <TooltipTrigger
        aria-label={`${cell.label}: ${cell.count} ${
          cell.count === 1 ? "transaction" : "transactions"
        }`}
        className={cn(
          "size-3.5 rounded-[3px] transition-transform duration-100 hover:scale-125",
          palette[cell.level],
        )}
      />
      <TooltipContent side="top" className="px-3 py-2">
        <p className="font-semibold">{cell.label}</p>
        {cell.count === 0 ? (
          <p className="text-muted-foreground text-xs">No activity</p>
        ) : (
          <div className="mt-1 space-y-0.5 text-xs">
            <p>
              {cell.count} {cell.count === 1 ? "transaction" : "transactions"}
            </p>
            {cell.income > 0 && (
              <p>In: {formatCurrency(cell.income, currency)}</p>
            )}
            {cell.expense > 0 && (
              <p>Out: {formatCurrency(cell.expense, currency)}</p>
            )}
            <p className="font-medium">
              Net: {net >= 0 ? "+" : ""}
              {formatCurrency(net, currency)}
            </p>
          </div>
        )}
      </TooltipContent>
    </Tooltip>
  );
}

export default function SpendingHeatmap() {
  const userEmail = useRouteUser();
  const activeCard = useActiveCard();
  const currency = usePreferredCurrency();

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: queryKeys.charts.dailyActivity(userEmail, activeCard),
    queryFn: () =>
      getDailyActivityServer({
        data: { email: userEmail, cardId: activeCard },
      }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 3,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
  });

  const rows = useMemo(() => data?.data ?? [], [data?.data]);
  const { weeks, monthLabels } = useMemo(() => buildCalendar(rows), [rows]);
  const { activeDays, busiest } = useMemo(() => summarize(rows), [rows]);

  const hasActivity = activeDays > 0;

  return (
    <Card
      className="rounded-2xl border-0 shadow-none"
      title="Daily activity"
      subtitle={
        hasActivity
          ? `${activeDays} active ${activeDays === 1 ? "day" : "days"} in the last ${WEEKS_TO_SHOW} weeks`
          : "Your last 13 weeks at a glance"
      }
    >
      {isLoading && <ChartLoading message="Loading daily activity..." />}

      {error && (
        <ChartError
          title="Failed to load daily activity"
          message={error.message}
          onRetry={() => refetch()}
        />
      )}

      {!isLoading && !error && !hasActivity && (
        <DataNotFoundPlaceholder>
          No activity yet. Add transactions to light up the graph!
        </DataNotFoundPlaceholder>
      )}

      {!isLoading && !error && hasActivity && (
        <div className="space-y-4">
          {busiest && (
            <Badge variant="outline" className="gap-1.5">
              <FlameIcon className="text-destructive size-3.5" />
              Busiest day:{" "}
              {new Date(`${busiest.date}T00:00:00Z`).toLocaleDateString(
                "en-US",
                { month: "short", day: "numeric", timeZone: "UTC" },
              )}{" "}
              · {formatCurrency(busiest.expense, currency)} out
            </Badge>
          )}

          <div className="overflow-x-auto pb-1">
            <div className="w-max min-w-full">
              <div className="text-muted-foreground mb-1 flex gap-1 text-[10px]">
                {weeks.map((_, weekIndex) => {
                  const label = monthLabels.find(
                    (m) => m.weekIndex === weekIndex,
                  );
                  return (
                    <span
                      key={weekIndex}
                      className="block w-3.5 overflow-visible whitespace-nowrap"
                    >
                      {label?.label ?? ""}
                    </span>
                  );
                })}
              </div>
              <div className="flex gap-1">
                {weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="flex flex-col gap-1">
                    {week.map((cell, dayIndex) => (
                      <HeatmapCell
                        key={cell.date ?? dayIndex}
                        cell={cell}
                        currency={currency}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 text-xs">
            <span className="flex items-center gap-1.5">
              <span className="bg-primary size-2.5 rounded-[2px]" />
              Net positive day
            </span>
            <span className="flex items-center gap-1.5">
              <span className="bg-destructive size-2.5 rounded-[2px]" />
              Net negative day
            </span>
            <span className="ml-auto flex items-center gap-1">
              Less
              {[0, 1, 2, 3, 4].map((level) => (
                <span
                  key={level}
                  className={cn(
                    "size-2.5 rounded-[2px]",
                    NEGATIVE_LEVELS[level],
                  )}
                />
              ))}
              More
            </span>
          </div>
        </div>
      )}
    </Card>
  );
}
