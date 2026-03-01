import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useRouteUser } from "~/hooks/use-route-user";
import { getTotalExpensesByEmailServer } from "~/lib/api/transaction/get-total-expenses-by-email";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import {
  AlertCircle,
  AlertTriangle,
  ChartSpline,
  CheckCircle2,
  Loader2,
  TrendingUp,
} from "lucide-react";

interface SpendingAlertBadgeProps {
  showIcon?: boolean;
  showPercentage?: boolean;
  animate?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  isActive?: boolean;
  className?: string;
}

type SpendingStatus =
  | "safe"
  | "moderate"
  | "warning"
  | "exceeded"
  | "zero"
  | "notSet"
  | "loading"
  | "error";

const currencyFormatter = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const statusConfig = {
  safe: {
    label: "Budget Safe",
    compactLabel: "Safe",
    color: "bg-emerald-500",
    variant: "outline" as const,
    icon: CheckCircle2,
    iconColor: "text-foreground/80",
    description: "Your spending is well within budget.",
  },
  moderate: {
    label: "Budget Moderate",
    compactLabel: "Moderate",
    color: "bg-blue-500",
    variant: "outline" as const,
    icon: TrendingUp,
    iconColor: "text-blue-500",
    description: "You're using a moderate amount of your budget.",
  },
  warning: {
    label: "Budget Warning",
    compactLabel: "Warning",
    color: "bg-amber-500",
    variant: "outline" as const,
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    description: "You're approaching your budget limit!",
  },
  exceeded: {
    label: "Budget Exceeded",
    compactLabel: "Exceeded",
    color: "bg-rose-500",
    variant: "outline" as const,
    icon: AlertCircle,
    iconColor: "text-rose-500",
    description: "You have exceeded your budget limit!",
  },
  zero: {
    label: "Zero Balance",
    compactLabel: "Zero",
    color: "bg-zinc-500",
    variant: "outline" as const,
    icon: AlertTriangle,
    iconColor: "text-zinc-500",
    description: "Your balance is zero or negative.",
  },
  notSet: {
    label: "Balance Not Set",
    compactLabel: "No Balance",
    color: "bg-muted",
    variant: "outline" as const,
    icon: ChartSpline,
    iconColor: "text-muted-foreground",
    description: "Please configure your balance to track spending.",
  },
  loading: {
    label: "Loading",
    compactLabel: "Loading",
    color: "bg-muted",
    variant: "outline" as const,
    icon: Loader2,
    iconColor: "text-muted-foreground",
    description: "Fetching budget information.",
  },
  error: {
    label: "Error",
    compactLabel: "Error",
    color: "bg-destructive",
    variant: "destructive" as const,
    icon: AlertCircle,
    iconColor: "text-destructive-foreground",
    description: "Failed to load budget data.",
  },
};

const detailStatuses = new Set<SpendingStatus>([
  "safe",
  "moderate",
  "warning",
  "exceeded",
]);

const toSafeNumber = (value: unknown) => {
  if (value === null || value === undefined) return 0;
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) return 0;
  return parsed;
};

const formatCurrency = (amount: number) => currencyFormatter.format(amount);

export function SpendingAlertBadge({
  showIcon = true,
  showPercentage = true,
  animate = true,
  compact = false,
  fullWidth = false,
  isActive = true,
  className = "",
}: SpendingAlertBadgeProps) {
  const userEmail = useRouteUser();

  const isQueryEnabled = Boolean(userEmail && isActive);

  const {
    data: spentData,
    isPending: isSpentLoading,
    error: spentError,
  } = useQuery({
    queryKey: ["total-expenses", userEmail],
    queryFn: () =>
      getTotalExpensesByEmailServer({ data: { email: userEmail } }),
    enabled: isQueryEnabled,
    staleTime: 1000 * 60 * 2,
    gcTime: 1000 * 60 * 5,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  const {
    data: userData,
    isPending: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: isQueryEnabled,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  const spent = useMemo(
    () => Math.max(0, toSafeNumber(spentData)),
    [spentData]
  );

  const balance = useMemo(
    () => Math.max(0, toSafeNumber(userData?.data?.totalBalance)),
    [userData?.data?.totalBalance]
  );

  const { status, percent } = useMemo(() => {
    if (isSpentLoading || isUserLoading) {
      return { status: "loading" as const, percent: 0 };
    }

    if (spentError || userError) {
      return { status: "error" as const, percent: 0 };
    }

    const rawBalance = toSafeNumber(userData?.data?.totalBalance);
    if (rawBalance <= 0) {
      return {
        status: rawBalance === 0 ? ("notSet" as const) : ("zero" as const),
        percent: 0,
      };
    }

    const rawPercent = (spent / rawBalance) * 100;
    const safePercent = Number.isFinite(rawPercent)
      ? Math.min(Math.max(rawPercent, 0), 9999)
      : 0;

    if (safePercent >= 100) {
      return { status: "exceeded" as const, percent: safePercent };
    }
    if (safePercent >= 80) {
      return { status: "warning" as const, percent: safePercent };
    }
    if (safePercent >= 50) {
      return { status: "moderate" as const, percent: safePercent };
    }

    return { status: "safe" as const, percent: safePercent };
  }, [isSpentLoading, isUserLoading, spentError, userError, spent, userData]);

  const remaining = useMemo(
    () => Math.max(0, balance - spent),
    [balance, spent]
  );

  if (!userEmail || !isActive) {
    return null;
  }

  if ((isSpentLoading || isUserLoading) && !spentData && !userData) {
    return null;
  }

  const config = statusConfig[status];
  const Icon = config.icon;
  const shouldAnimateDot =
    animate && (status === "warning" || status === "exceeded");
  const shouldAnimateIcon = status === "loading";
  const canShowDetails = detailStatuses.has(status);
  const percentLabel = `${Math.round(percent)}%`;

  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Badge
              variant={config.variant}
              className={cn(
                "inline-flex max-w-full min-w-0 items-center gap-2 rounded-full border border-border/70 bg-background/85 px-3 py-1.5 text-foreground shadow-xs backdrop-blur-[2px] select-none transition-colors duration-200 hover:bg-muted/70",
                fullWidth && "h-10 w-full rounded-xl px-3.5 py-2",
                compact && "h-8 px-2.5 py-1",
                !compact && !fullWidth && "h-9",
                className
              )}
              aria-live="polite"
            >
              <span
                className={cn(
                  "relative inline-flex h-2 w-2 rounded-full",
                  config.color
                )}
                aria-hidden="true"
              >
                {shouldAnimateDot && (
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                      config.color
                    )}
                  />
                )}
              </span>

              {showIcon && (
                <Icon
                  className={cn(
                    "h-3.5 w-3.5 shrink-0",
                    fullWidth && "h-4 w-4",
                    shouldAnimateIcon && "animate-spin",
                    config.iconColor
                  )}
                  aria-hidden="true"
                />
              )}

              <span className="inline-flex min-w-0 flex-1 items-center gap-2">
                <span className="truncate text-xs font-medium">
                  {compact ? config.compactLabel : config.label}
                </span>

                {showPercentage && canShowDetails && (
                  <span className="shrink-0 font-mono text-xs tabular-nums">
                    {percentLabel}
                  </span>
                )}
              </span>
            </Badge>
          }
        />

        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
              <span className="text-xs font-semibold">
                Budget Status: {config.label}
              </span>
            </div>
            <p className="text-[10px]">{config.description}</p>

            {canShowDetails && (
              <div className="mt-1 space-y-1 border-t border-border pt-1">
                <div className="flex items-center justify-between gap-4 text-[10px]">
                  <span>Total budget:</span>
                  <span className="font-mono font-semibold">
                    {formatCurrency(balance)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-[10px]">
                  <span>Spent:</span>
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      percent >= 80 && "text-rose-500"
                    )}
                  >
                    {formatCurrency(spent)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 text-[10px]">
                  <span>Remaining:</span>
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      remaining > 0 ? "text-foreground" : "text-rose-500"
                    )}
                  >
                    {formatCurrency(remaining)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 border-t border-border pt-1 text-[10px]">
                  <span>Usage:</span>
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      percent < 50 && "text-foreground",
                      percent >= 50 && percent < 80 && "text-blue-500",
                      percent >= 80 && percent < 100 && "text-amber-500",
                      percent >= 100 && "text-rose-500"
                    )}
                  >
                    {percent.toFixed(1)}%
                  </span>
                </div>
              </div>
            )}

            {(spentError || userError) && (
              <p className="mt-1 border-t border-border pt-1 text-[10px] text-destructive">
                {spentError instanceof Error
                  ? spentError.message
                  : userError instanceof Error
                    ? userError.message
                    : "Unknown error occurred"}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
