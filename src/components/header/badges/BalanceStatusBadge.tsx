import type { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { cn } from "~/lib/utils";
import {
  formatCurrency,
  type SupportedCurrency,
} from "~/utils/format-currency";
import { queryDictionary } from "~/queries/dictionary";
import type { ApiResponse } from "~/types/ApiResponse";
import {
  AlertCircle,
  Loader2,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

import { BadgeIcon, HeaderBadge, StatusDot } from "./HeaderBadge";

interface BalanceStatusBadgeProps {
  showIcon?: boolean;
  showAmount?: boolean;
  animate?: boolean;
  compact?: boolean;
  fullWidth?: boolean;
  isActive?: boolean;
  className?: string;
}

type BalanceStatus = "surplus" | "balanced" | "deficit" | "loading" | "error";

const statusConfig = {
  surplus: {
    label: "Surplus",
    color: "bg-primary",
    variant: "secondary" as const,
    icon: TrendingUp,
    iconColor: "text-primary",
    description: "Your balance is positive.",
  },
  balanced: {
    label: "Balanced",
    color: "bg-secondary",
    variant: "secondary" as const,
    icon: Minus,
    iconColor: "text-secondary-foreground",
    description: "Your balance is at zero.",
  },
  deficit: {
    label: "Deficit",
    color: "bg-destructive",
    variant: "destructive" as const,
    icon: TrendingDown,
    iconColor: "text-destructive",
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
  compact = false,
  fullWidth = false,
  isActive = true,
  className = "",
}: BalanceStatusBadgeProps) {
  const userEmail = useRouteUser();
  const currency = usePreferredCurrency();

  const { error, isPending, data } = useQuery<ApiResponse<User | null>>({
    queryKey: [queryDictionary.user, userEmail],
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    enabled: Boolean(userEmail && isActive),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
    retry: 1,
    retryDelay: 1000,
    refetchOnWindowFocus: false,
  });

  const getStatus = (): BalanceStatus => {
    if (error) return "error";
    if (isPending) return "loading";
    if (data?.error || !data?.data) return "error";

    const balance = data.data.totalBalance;
    if (balance === undefined || balance === null) return "error";
    if (balance > 0) return "surplus";
    if (balance < 0) return "deficit";
    return "balanced";
  };

  const status = getStatus();
  const config = statusConfig[status];
  const balance = data?.data?.totalBalance ?? 0;

  if (!userEmail) return null;

  return (
    <HeaderBadge
      variant={config.variant}
      compact={compact}
      fullWidth={fullWidth}
      isActive={isActive}
      className={className}
      tooltipContent={
        <BalanceTooltip
          config={config}
          status={status}
          balance={balance}
          error={error}
          currency={currency}
        />
      }
    >
      <StatusDot
        color={config.color}
        animate={animate && status === "surplus"}
      />

      {showIcon && (
        <BadgeIcon
          icon={config.icon}
          className={config.iconColor}
          fullWidth={fullWidth}
          animate={status === "loading"}
        />
      )}

      <span className="text-xs font-medium">
        {config.label}
        {showAmount && status !== "loading" && status !== "error" && (
          <span className="ml-1.5 font-mono">
            {formatCurrency(balance, currency)}
          </span>
        )}
      </span>
    </HeaderBadge>
  );
}

function BalanceTooltip({
  config,
  status,
  balance,
  error,
  currency,
}: {
  config: (typeof statusConfig)[keyof typeof statusConfig];
  status: BalanceStatus;
  balance: number;
  error: Error | null;
  currency: SupportedCurrency;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
        <span className="text-xs font-semibold">
          Balance Status: {config.label}
        </span>
      </div>
      <p className="text-[10px]">{config.description}</p>

      {status !== "loading" && status !== "error" && (
        <div className="border-border mt-1 border-t pt-1">
          <div className="flex items-center justify-between gap-4 text-[10px]">
            <span>Current balance:</span>
            <span className={cn("font-mono font-semibold")}>
              {formatCurrency(balance, currency)}
            </span>
          </div>
        </div>
      )}

      {error && (
        <p className="border-border text-destructive mt-1 border-t pt-1 text-[10px]">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      )}
    </div>
  );
}
