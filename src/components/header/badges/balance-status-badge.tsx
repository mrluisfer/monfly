import { useQuery } from "@tanstack/react-query";
import { Badge } from "~/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useRouteUser } from "~/hooks/use-route-user";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email.server";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import {
  AlertCircle,
  Loader2,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

interface BalanceStatusBadgeProps {
  showIcon?: boolean;
  showAmount?: boolean;
  animate?: boolean;
  className?: string;
}

type BalanceStatus = "surplus" | "balanced" | "deficit" | "loading" | "error";

const statusConfig = {
  surplus: {
    label: "Surplus",
    color: "bg-emerald-500",
    variant: "secondary" as const,
    icon: TrendingUp,
    iconColor: "text-emerald-500",
    description: "Your balance is positive.",
  },
  balanced: {
    label: "Balanced",
    color: "bg-blue-500",
    variant: "secondary" as const,
    icon: Minus,
    iconColor: "text-blue-500",
    description: "Your balance is at zero.",
  },
  deficit: {
    label: "Deficit",
    color: "bg-rose-500",
    variant: "destructive" as const,
    icon: TrendingDown,
    iconColor: "text-rose-500",
    description: "Your balance is negative.",
  },
  loading: {
    label: "Loading...",
    color: "bg-muted",
    variant: "outline" as const,
    icon: Loader2,
    iconColor: "text-muted-foreground",
    description: "Fetching balance information.",
  },
  error: {
    label: "Error",
    color: "bg-destructive",
    variant: "destructive" as const,
    icon: AlertCircle,
    iconColor: "text-destructive-foreground",
    description: "Failed to load balance.",
  },
};

export function BalanceStatusBadge({
  showIcon = true,
  showAmount = false,
  animate = true,
  className = "",
}: BalanceStatusBadgeProps) {
  const userEmail = useRouteUser();

  const { error, isPending, data } = useQuery({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: !!userEmail,
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
  });

  // Determine status based on query state and balance
  const getStatus = (): BalanceStatus => {
    if (error) return "error";
    if (isPending) return "loading";

    const balance = data?.data?.totalBalance;
    if (balance === undefined || balance === null) return "error";

    if (balance > 0) return "surplus";
    if (balance < 0) return "deficit";
    return "balanced";
  };

  const status = getStatus();
  const config = statusConfig[status];
  const Icon = config.icon;
  const balance = data?.data?.totalBalance ?? 0;

  // Format balance for display
  const formatBalance = (amount: number) => {
    return new Intl.NumberFormat("es-MX", {
      style: "currency",
      currency: "MXN",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  };

  // Don't render if no user email
  if (!userEmail) return null;

  return (
    <TooltipProvider>
      <Tooltip delayDuration={200}>
        <TooltipTrigger asChild>
          <Badge
            variant={config.variant}
            className={cn(
              "inline-flex items-center gap-2 px-3 py-2 select-none transition-all hover:scale-105",
              className
            )}
          >
            <span
              className={cn("relative flex h-2 w-2 rounded-full", config.color)}
              aria-hidden="true"
            >
              {animate && status === "surplus" && (
                <>
                  <span
                    className={cn(
                      "absolute inline-flex h-full w-full rounded-full animate-ping",
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
              {showAmount && status !== "loading" && status !== "error" && (
                <span className="ml-1.5 font-mono">
                  {formatBalance(balance)}
                </span>
              )}
            </span>
          </Badge>
        </TooltipTrigger>

        <TooltipContent side="bottom" className="max-w-xs">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
              <span className="font-semibold text-xs">
                Balance Status: {config.label}
              </span>
            </div>
            <p className="text-[10px]">{config.description}</p>
            {status !== "loading" && status !== "error" && (
              <div className="border-t border-border pt-1 mt-1">
                <div className="flex items-center justify-between gap-4 text-[10px]">
                  <span>Current balance:</span>
                  <span
                    className={cn(
                      "font-mono font-semibold",
                      balance > 0 && "text-emerald-500",
                      balance < 0 && "text-rose-500"
                    )}
                  >
                    {formatBalance(balance)}
                  </span>
                </div>
              </div>
            )}
            {error && (
              <p className="text-[10px] text-destructive border-t border-border pt-1 mt-1">
                {error instanceof Error
                  ? error.message
                  : "Unknown error occurred"}
              </p>
            )}
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
