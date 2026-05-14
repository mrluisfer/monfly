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
    <article className="bg-muted border-border/70 rounded-2xl border p-4 sm:p-5">
      <div className="flex items-center gap-2">
        <TrendIcon
          className={cn(
            "size-4",
            isPositiveLast30 ? "text-primary" : "text-destructive",
          )}
        />
        <h4 className="text-foreground text-base font-semibold tracking-tight">
          Expense concentration
        </h4>
      </div>

      <div className="mt-4 space-y-3">
        {topCategories.length ? (
          topCategories.map((category) => (
            <div key={category.category} className="space-y-1.5">
              <div className="flex items-center justify-between gap-2 text-sm">
                <span className="text-foreground truncate">
                  {category.category}
                </span>
                <span className="text-muted-foreground">
                  {Math.round(category.share * 100)}%
                </span>
              </div>
              <div className="bg-muted h-2 overflow-hidden rounded-full">
                <div
                  className="bg-primary/80 h-full rounded-full"
                  style={{
                    width: `${Math.max(8, Math.round(category.share * 100))}%`,
                  }}
                />
              </div>
              <div className="text-muted-foreground text-xs">
                {formatCurrency(category.amount, "USD")}
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground text-sm">
            No expense categories yet to analyze.
          </p>
        )}
      </div>

      <div className="border-border/60 text-muted-foreground mt-4 border-t pt-3 text-xs">
        Total tracked: {formatCurrency(totalIncome, "USD")} in •{" "}
        {formatCurrency(totalExpense, "USD")} out
      </div>
    </article>
  );
}
