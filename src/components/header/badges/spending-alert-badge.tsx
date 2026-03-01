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
  className?: string;
}

type SpendingStatus =
  | "safe" // < 50%
  | "moderate" // 50-79%
  | "warning" // 80-99%
  | "exceeded" // >= 100%
  | "zero" // balance <= 0
  | "notSet" // balance not configured
  | "loading"
  | "error";

const statusConfig = {
  safe: {
    label: "Budget Safe",
    color: "bg-emerald-500",
    variant: "secondary" as const,
    icon: CheckCircle2,
    iconColor: "dark:text-white text-black",
    description: "Your spending is well within budget.",
  },
  moderate: {
    label: "Budget Moderate",
    color: "bg-blue-500",
    variant: "secondary" as const,
    icon: TrendingUp,
    iconColor: "text-blue-500",
    description: "You're using a moderate amount of your budget.",
  },
  warning: {
    label: "Budget Warning",
    color: "bg-amber-500",
    variant: "destructive" as const,
    icon: AlertTriangle,
    iconColor: "text-amber-500",
    description: "You're approaching your budget limit!",
  },
  exceeded: {
    label: "Budget Exceeded",
    color: "bg-rose-500",
    variant: "destructive" as const,
    icon: AlertCircle,
    iconColor: "text-rose-500",
    description: "You have exceeded your budget limit!",
  },
  zero: {
    label: "Zero Balance",
    color: "bg-zinc-500",
    variant: "secondary" as const,
    icon: AlertTriangle,
    iconColor: "text-zinc-500",
    description: "Your balance is zero or negative.",
  },
  notSet: {
    label: "Balance Not Set",
    color: "bg-muted",
    variant: "outline" as const,
    icon: ChartSpline,
    iconColor: "text-muted-foreground",
    description: "Please configure your balance to track spending.",
  },
  loading: {
    label: "Loading",
    color: "bg-muted",
    variant: "outline" as const,
    icon: Loader2,
    iconColor: "text-muted-foreground",
    description: "Fetching budget information.",
  },
  error: {
    label: "Error",
    color: "bg-destructive",
    variant: "destructive" as const,
    icon: AlertCircle,
    iconColor: "text-destructive-foreground",
    description: "Failed to load budget data.",
  },
};

export function SpendingAlertBadge({
  showIcon = true,
  showPercentage = true,
  animate = true,
  className = "",
}: SpendingAlertBadgeProps) {
  const userEmail = useRouteUser();

  const {
    data: spentData,
    isPending: isSpentLoading,
    error: spentError,
  } = useQuery({
    queryKey: ["total-expenses", userEmail],
    queryFn: () =>
      getTotalExpensesByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 2, // 2 minutes cache
    gcTime: 1000 * 60 * 5, // 5 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  // Safely extract and validate spent amount
  const spent = (() => {
    if (!spentData) return 0;
    const value = Number(spentData);
    if (isNaN(value) || !isFinite(value)) {
      console.warn("Invalid spent data received:", spentData);
      return 0;
    }
    return Math.max(0, value);
  })();

  const {
    data: userData,
    isPending: isUserLoading,
    error: userError,
  } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5, // 5 minutes cache
    gcTime: 1000 * 60 * 10, // 10 minutes garbage collection
    retry: 1,
    retryDelay: 1000,
  });

  // Determine status based on query state and spending
  const getStatus = (): { status: SpendingStatus; percent: number } => {
    if (isSpentLoading || isUserLoading) {
      return { status: "loading", percent: 0 };
    }

    if (spentError || userError) {
      return { status: "error", percent: 0 };
    }

    const balance = (() => {
      const rawBalance = userData?.data?.totalBalance;
      if (rawBalance === null || rawBalance === undefined) return 0;
      const value = Number(rawBalance);
      if (isNaN(value) || !isFinite(value)) {
        console.warn("Invalid balance data received:", rawBalance);
        return 0;
      }
      return value;
    })();

    if (!balance || balance <= 0) {
      return { status: balance === 0 ? "notSet" : "zero", percent: 0 };
    }

    const safeSpent = isNaN(spent) || !isFinite(spent) ? 0 : spent;
    const rawPercent = (safeSpent / balance) * 100;
    const percent =
      isNaN(rawPercent) || !isFinite(rawPercent)
        ? 0
        : Math.min(rawPercent, 9999);

    if (percent >= 100) return { status: "exceeded", percent };
    if (percent >= 80) return { status: "warning", percent };
    if (percent >= 50) return { status: "moderate", percent };
    return { status: "safe", percent };
  };

  const { status, percent } = getStatus();
  const config = statusConfig[status];
  const Icon = config.icon;

  // Format currency with NaN protection
  const formatCurrency = (amount: number) => {
    const safeAmount = isNaN(amount) || !isFinite(amount) ? 0 : amount;
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(safeAmount);
  };

  const balance = (() => {
    const rawBalance = userData?.data?.totalBalance;
    if (rawBalance === null || rawBalance === undefined) return 0;
    const value = Number(rawBalance);
    return isNaN(value) || !isFinite(value) ? 0 : value;
  })();

  const remaining = (() => {
    const safeSpent = isNaN(spent) || !isFinite(spent) ? 0 : spent;
    const result = balance - safeSpent;
    return isNaN(result) || !isFinite(result) ? 0 : Math.max(result, 0);
  })();

  // Don't render if no user email
  if (!userEmail) return null;

  // Don't render if we're still loading initial data
  if ((isSpentLoading || isUserLoading) && !spentData && !userData) {
    return null;
  }

  // Determine if badge should animate
  const shouldAnimate =
    animate && (status === "warning" || status === "exceeded");

  return (
    <TooltipProvider delay={200}>
      <Tooltip>
        <TooltipTrigger
          render={
            <Badge
              variant={config.variant}
              className={cn(
                "inline-flex items-center gap-2 px-3 py-1.5 select-none transition-all hover:scale-105",
                shouldAnimate && "",
                className
              )}
              aria-live="polite"
            >
              <span
                className={cn("relative flex h-2 w-2 rounded-full", config.color)}
                aria-hidden="true"
              >
                {animate && status === "safe" && (
                  <>
                    <span
                      className={cn(
                        "absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping",
                        config.color
                      )}
                    />
                    <span
                      className={cn(
                        "relative inline-flex h-2 w-2 rounded-full",
                        config.color
                      )}
                    />
                  </>
                )}
              </span>

              {showIcon && (
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    status === "loading" ? "animate-spin" : "",
                    config.iconColor
                  )}
                  aria-hidden="true"
                />
              )}

              <span className="text-xs font-medium">
                {config.label}
                {showPercentage &&
                  status !== "loading" &&
                  status !== "error" &&
                  status !== "notSet" &&
                  status !== "zero" && (
                    <span className="ml-1.5 font-mono">
                      (
                      {isNaN(percent) || !isFinite(percent)
                        ? "0"
                        : percent.toFixed(0)}
                      %)
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
              <span className="font-semibold text-xs">
                Budget Status: {config.label}
              </span>
            </div>
            <p className="text-[10px] ">{config.description}</p>

            {status !== "loading" &&
              status !== "error" &&
              status !== "notSet" &&
              status !== "zero" && (
                <div className="border-t border-border pt-1 mt-1 space-y-1">
                  <div className="flex items-center justify-between gap-4 text-[10px]">
                    <span className="">Total budget:</span>
                    <span className="font-mono font-semibold">
                      {formatCurrency(balance)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-[10px]">
                    <span className="">Spent:</span>
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
                    <span className="">Remaining:</span>
                    <span
                      className={cn(
                        "font-mono font-semibold",
                        remaining > 0 ? "dark:text-black" : "text-rose-500"
                      )}
                    >
                      {formatCurrency(remaining)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-4 text-[10px] pt-1 border-t border-border">
                    <span className="">Usage:</span>
                    <span
                      className={cn(
                        "font-mono font-semibold",
                        percent < 50 && "dark:text-black",
                        percent >= 50 && percent < 80 && "text-blue-500",
                        percent >= 80 && percent < 100 && "text-amber-500",
                        percent >= 100 && "text-rose-500"
                      )}
                    >
                      {isNaN(percent) || !isFinite(percent)
                        ? "0.0"
                        : percent.toFixed(1)}
                      %
                    </span>
                  </div>
                </div>
              )}

            {(spentError || userError) && (
              <p className="text-[10px] text-destructive border-t border-border pt-1 mt-1">
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
