import { cn } from "~/lib/utils";
import { formatCurrency } from "~/utils/format-currency";
import { TrendingDownIcon, TrendingUpIcon } from "lucide-react";

type TopCategory = {
  amount: number;
  category: string;
  share: number;
};

type ExpenseConcentrationCardProps = {
  isPositiveLast30: boolean;
  topCategories: TopCategory[];
  totalExpense: number;
  totalIncome: number;
};

export function ExpenseConcentrationCard({
  isPositiveLast30,
  topCategories,
  totalExpense,
  totalIncome,
}: ExpenseConcentrationCardProps) {
  const TrendIcon = isPositiveLast30 ? TrendingUpIcon : TrendingDownIcon;

  return (
    <article className="bg-muted rounded-2xl border border-border/70 p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <TrendIcon
          className={cn(
            "size-4",
            isPositiveLast30 ? "text-primary" : "text-destructive"
          )}
        />
        <h4 className="text-base font-semibold tracking-tight text-foreground">
          Expense concentration
        </h4>
      </div>

      <div className="mt-4 space-y-3">
        {topCategories.length ? (
          topCategories.map((category) => (
            <div key={category.category} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="truncate text-foreground">
                  {category.category}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(category.share * 100)}%
                </span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/80"
                  style={{
                    width: `${Math.max(8, Math.round(category.share * 100))}%`,
                  }}
                />
              </div>
              <div className="text-xs text-muted-foreground">
                {formatCurrency(category.amount, "USD")}
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-muted-foreground">
            No expense categories yet to analyze.
          </p>
        )}
      </div>

      <div className="mt-4 border-t border-border/60 pt-3 text-xs text-muted-foreground">
        Total tracked: {formatCurrency(totalIncome, "USD")} in •{" "}
        {formatCurrency(totalExpense, "USD")} out
      </div>
    </article>
  );
}
