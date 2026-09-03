import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";
import Card from "~/components/shared/Card";
import { FlowBar } from "~/components/shared/FlowBar";
import { useCurrency } from "~/hooks/useCurrency";
import { cn } from "~/lib/utils";

interface TopCategory {
  amount: number;
  category: string;
  share: number;
}

interface ExpenseConcentrationCardProps {
  isPositiveLast30: boolean;
  topCategories: TopCategory[];
  totalExpense: number;
  totalIncome: number;
}

export function ExpenseConcentrationCard({
  isPositiveLast30,
  topCategories,
  totalExpense,
  totalIncome,
}: ExpenseConcentrationCardProps) {
  const { format: formatAmount } = useCurrency();
  const TrendIcon = isPositiveLast30 ? TrendingUpIcon : TrendingDownIcon;

  return (
    <Card
      title={
        <span className="flex items-center gap-2">
          <TrendIcon
            className={cn(
              "size-4",
              isPositiveLast30 ? "text-success" : "text-destructive",
            )}
            aria-hidden="true"
          />
          Expense concentration
        </span>
      }
      subtitle="Share of total expenses by category."
      Footer={
        <p className="text-muted-foreground text-xs">
          Total tracked: {formatAmount(totalIncome)} in •{" "}
          {formatAmount(totalExpense)} out
        </p>
      }
    >
      <div className="space-y-3">
        {topCategories.length ? (
          topCategories.map((category) => (
            <div key={category.category} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate text-foreground">
                  {category.category}
                </span>
                <span className="text-muted-foreground tabular-nums">
                  {Math.round(category.share * 100)}%
                </span>
              </div>
              {/* ponytail: shared FlowBar — the local copy used bg-muted on a
                  bg-muted card, so the track was invisible. */}
              <FlowBar
                ratio={category.share}
                tone="primary"
                ariaLabel={`${category.category} share of total expenses`}
              />
              <p className="text-muted-foreground text-xs">
                {formatAmount(category.amount)}
              </p>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            No expense categories yet to analyze.
          </p>
        )}
      </div>
    </Card>
  );
}
