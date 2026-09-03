import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  AlertTriangle,
  ChartSpline,
  CheckCircle2,
  Loader2,
  TrendingUp,
} from "lucide-react";
import { useMemo } from "react";
import { useCurrency } from "~/hooks/useCurrency";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getTotalExpensesByEmailServer } from "~/lib/api/transaction/get-total-expenses-by-email";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { queryKeys } from "~/utils/query-keys";
import { BadgeIcon, HeaderBadge, StatusDot } from "./HeaderBadge";

interface SpendingAlertBadgeProps {
  animate?: boolean;
  className?: string;
  compact?: boolean;
  fullWidth?: boolean;
  isActive?: boolean;
  showIcon?: boolean;
  showPercentage?: boolean;
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

const statusConfig = {
  error: {
    color: "bg-destructive",
    compactLabel: "Error",
    description: "Failed to load budget data.",
    icon: AlertCircle,
    iconColor: "text-destructive-foreground",
    label: "Error",
    variant: "destructive" as const,
  },
  exceeded: {
    color: "bg-destructive",
    compactLabel: "Exceeded",
    description: "You have exceeded your budget limit!",
    icon: AlertCircle,
    iconColor: "text-destructive",
    label: "Budget Exceeded",
    variant: "outline" as const,
  },
  loading: {
    color: "bg-muted",
    compactLabel: "Loading",
    description: "Fetching budget information.",
    icon: Loader2,
    iconColor: "text-muted-foreground",
    label: "Loading",
    variant: "outline" as const,
  },
  moderate: {
    color: "bg-secondary",
    compactLabel: "Moderate",
    description: "You're using a moderate amount of your budget.",
    icon: TrendingUp,
    iconColor: "text-secondary-foreground",
    label: "Budget Moderate",
    variant: "outline" as const,
  },
  notSet: {
    color: "bg-muted",
    compactLabel: "No Balance",
    description: "Please configure your balance to track spending.",
    icon: ChartSpline,
    iconColor: "text-muted-foreground",
    label: "Balance Not Set",
    variant: "outline" as const,
  },
  safe: {
    color: "bg-primary",
    compactLabel: "Safe",
    description: "Your spending is well within budget.",
    icon: CheckCircle2,
    iconColor: "text-primary",
    label: "Budget Safe",
    variant: "outline" as const,
  },
  warning: {
    color: "bg-accent",
    compactLabel: "Warning",
    description: "You're approaching your budget limit!",
    icon: AlertTriangle,
    iconColor: "text-accent-foreground",
    label: "Budget Warning",
    variant: "outline" as const,
  },
  zero: {
    color: "bg-muted",
    compactLabel: "Zero",
    description: "Your balance is zero or negative.",
    icon: AlertTriangle,
    iconColor: "text-muted-foreground",
    label: "Zero Balance",
    variant: "outline" as const,
  },
};

const detailStatuses = new Set<SpendingStatus>([
  "safe",
  "moderate",
  "warning",
  "exceeded",
]);

const toSafeNumber = (value: unknown) => {
  if (value === null || value === undefined) {
    return 0;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed)) {
    return 0;
  }
  return parsed;
};

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
    enabled: isQueryEnabled,
    gcTime: 1000 * 60 * 5,
    queryFn: () =>
      getTotalExpensesByEmailServer({ data: { email: userEmail } }),
    queryKey: queryKeys.transactions.totalExpenses(userEmail),
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 2,
  });

  const {
    data: userData,
    isPending: isUserLoading,
    error: userError,
  } = useQuery({
    enabled: isQueryEnabled,
    gcTime: 1000 * 60 * 10,
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    queryKey: [queryDictionary.user, userEmail],
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5,
  });

  const spent = useMemo(
    () => Math.max(0, toSafeNumber(spentData)),
    [spentData],
  );

  const balance = useMemo(
    () => Math.max(0, toSafeNumber(userData?.data?.totalBalance)),
    [userData?.data?.totalBalance],
  );

  const { status, percent } = useMemo(() => {
    if (isSpentLoading || isUserLoading) {
      return { percent: 0, status: "loading" as const };
    }

    if (spentError || userError) {
      return { percent: 0, status: "error" as const };
    }

    const rawBalance = toSafeNumber(userData?.data?.totalBalance);
    if (rawBalance <= 0) {
      return {
        percent: 0,
        status: rawBalance === 0 ? ("notSet" as const) : ("zero" as const),
      };
    }

    const rawPercent = (spent / rawBalance) * 100;
    const safePercent = Number.isFinite(rawPercent)
      ? Math.min(Math.max(rawPercent, 0), 9999)
      : 0;

    if (safePercent >= 100) {
      return { percent: safePercent, status: "exceeded" as const };
    }
    if (safePercent >= 80) {
      return { percent: safePercent, status: "warning" as const };
    }
    if (safePercent >= 50) {
      return { percent: safePercent, status: "moderate" as const };
    }

    return { percent: safePercent, status: "safe" as const };
  }, [isSpentLoading, isUserLoading, spentError, userError, spent, userData]);

  const remaining = useMemo(
    () => Math.max(0, balance - spent),
    [balance, spent],
  );

  if (!(userEmail && isActive)) {
    return null;
  }

  if ((isSpentLoading || isUserLoading) && !spentData && !userData) {
    return null;
  }

  const config = statusConfig[status];
  const shouldAnimateDot =
    animate && (status === "warning" || status === "exceeded");
  const canShowDetails = detailStatuses.has(status);
  const percentLabel = `${Math.round(percent)}%`;

  return (
    <HeaderBadge
      variant={config.variant}
      compact={compact}
      fullWidth={fullWidth}
      isActive={isActive}
      className={className}
      ariaLive="polite"
      tooltipContent={
        <SpendingTooltip
          config={config}
          canShowDetails={canShowDetails}
          balance={balance}
          spent={spent}
          remaining={remaining}
          percent={percent}
          spentError={spentError}
          userError={userError}
        />
      }
    >
      <StatusDot color={config.color} animate={shouldAnimateDot} />

      {showIcon ? (
        <BadgeIcon
          icon={config.icon}
          className={config.iconColor}
          fullWidth={fullWidth}
          animate={status === "loading"}
        />
      ) : null}

      <span className="inline-flex min-w-0 flex-1 items-center gap-2">
        <span className="truncate font-medium text-xs">
          {compact ? config.compactLabel : config.label}
        </span>

        {showPercentage && canShowDetails ? (
          <span className="shrink-0 font-mono text-xs tabular-nums">
            {percentLabel}
          </span>
        ) : null}
      </span>
    </HeaderBadge>
  );
}

function SpendingTooltip({
  config,
  canShowDetails,
  balance,
  spent,
  remaining,
  percent,
  spentError,
  userError,
}: {
  config: (typeof statusConfig)[keyof typeof statusConfig];
  canShowDetails: boolean;
  balance: number;
  spent: number;
  remaining: number;
  percent: number;
  spentError: Error | null;
  userError: Error | null;
}) {
  const { formatPlain } = useCurrency();

  // Whichever request failed first has the message worth showing.
  const failure = [spentError, userError].find(
    (candidate) => candidate instanceof Error,
  );
  const errorMessage = failure?.message ?? "Unknown error occurred";

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
        <span className="font-semibold text-xs">
          Budget Status: {config.label}
        </span>
      </div>
      <p className="text-[10px]">{config.description}</p>

      {canShowDetails ? (
        <div className="mt-1 space-y-1 border-border border-t pt-1">
          <div className="flex items-center justify-between gap-4 text-[10px]">
            <span>Total budget:</span>
            <span className="font-mono font-semibold">
              {formatPlain(balance)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[10px]">
            <span>Spent:</span>
            <span
              className={cn(
                "font-mono font-semibold",
                percent >= 80 && "text-destructive",
              )}
            >
              {formatPlain(spent)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 text-[10px]">
            <span>Remaining:</span>
            <span
              className={cn(
                "font-mono font-semibold",
                remaining > 0 ? "text-foreground" : "text-destructive",
              )}
            >
              {formatPlain(remaining)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 border-border border-t pt-1 text-[10px]">
            <span>Usage:</span>
            <span
              className={cn(
                "font-mono font-semibold",
                percent < 50 && "text-foreground",
                percent >= 50 && percent < 80 && "text-secondary-foreground",
                percent >= 80 && percent < 100 && "text-accent-foreground",
                percent >= 100 && "text-destructive",
              )}
            >
              {percent.toFixed(1)}%
            </span>
          </div>
        </div>
      ) : null}

      {spentError || userError ? (
        <p className="mt-1 border-border border-t pt-1 text-[10px] text-destructive">
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
