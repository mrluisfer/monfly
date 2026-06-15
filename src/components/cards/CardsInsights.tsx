import { LayersIcon, TrendingUpIcon, WalletIcon } from "lucide-react";

import { CARD_FALLBACK_COLORS } from "~/constants/card-status";
import { Card, CardContent } from "~/components/ui/card";
import { MetricCard } from "~/components/ui/metric-card";
import { Skeleton } from "~/components/ui/skeleton";
import { useCards } from "~/hooks/cards";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { formatCurrency } from "~/utils/format-currency";

export function CardsInsights() {
  const { data, isPending } = useCards();
  const currency = usePreferredCurrency();
  const cards = data?.data ?? [];

  if (isPending) {
    return (
      <div className="grid gap-3 sm:grid-cols-3">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-[5.5rem] rounded-2xl" />
        ))}
      </div>
    );
  }

  if (cards.length === 0) return null;

  const activeCards = cards.filter((c) => c.status !== "archived");
  const archivedCount = cards.length - activeCards.length;

  const total = activeCards.reduce((sum, c) => sum + (c.balance ?? 0), 0);
  const topCard = activeCards.reduce<(typeof activeCards)[number] | null>(
    (best, c) =>
      (c.balance ?? 0) > (best?.balance ?? Number.NEGATIVE_INFINITY)
        ? c
        : best,
    null,
  );

  // Distribution only makes sense for the positive-balance share of the total.
  // Use the card's own accent color when set, else cycle the theme palette.
  const positiveCards = activeCards
    .filter((c) => (c.balance ?? 0) > 0)
    .map((c, i) => ({
      id: c.id,
      name: c.name,
      balance: c.balance ?? 0,
      color:
        c.color ?? CARD_FALLBACK_COLORS[i % CARD_FALLBACK_COLORS.length],
    }));
  const positiveTotal = positiveCards.reduce((sum, c) => sum + c.balance, 0);

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        <MetricCard
          label="Total across cards"
          value={formatCurrency(total, currency)}
          icon={<WalletIcon className="size-4" />}
          accent="primary"
          helper={`${activeCards.length} active ${
            activeCards.length === 1 ? "card" : "cards"
          }`}
        />
        <MetricCard
          label="Active cards"
          value={activeCards.length}
          icon={<LayersIcon className="size-4" />}
          accent="info"
          helper={
            archivedCount > 0 ? `${archivedCount} archived` : "All cards active"
          }
        />
        <MetricCard
          label="Top balance"
          value={formatCurrency(topCard?.balance ?? 0, currency)}
          icon={<TrendingUpIcon className="size-4" />}
          accent="success"
          helper={topCard?.name ?? "—"}
        />
      </div>

      {positiveTotal > 0 && (
        <Card className="rounded-2xl">
          <CardContent className="space-y-4 p-4 sm:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-sm font-semibold tracking-tight">
                Balance distribution
              </h3>
              <span className="text-muted-foreground text-xs">
                across {positiveCards.length}{" "}
                {positiveCards.length === 1 ? "card" : "cards"}
              </span>
            </div>

            <div className="bg-muted flex h-3 w-full overflow-hidden rounded-full">
              {positiveCards.map((c) => (
                <div
                  key={c.id}
                  className="h-full transition-[width] duration-500"
                  style={{
                    width: `${(c.balance / positiveTotal) * 100}%`,
                    backgroundColor: c.color,
                  }}
                  title={`${c.name}: ${formatCurrency(c.balance, currency)}`}
                />
              ))}
            </div>

            <ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
              {positiveCards.map((c) => {
                const pct = (c.balance / positiveTotal) * 100;
                return (
                  <li
                    key={c.id}
                    className="flex items-center justify-between gap-3 text-sm"
                  >
                    <span className="flex min-w-0 items-center gap-2">
                      <span
                        className="size-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: c.color }}
                        aria-hidden="true"
                      />
                      <span className="truncate capitalize">{c.name}</span>
                    </span>
                    <span className="text-muted-foreground shrink-0 tabular-nums">
                      {formatCurrency(c.balance, currency)}
                      <span className="ml-1.5 text-xs">{pct.toFixed(0)}%</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
