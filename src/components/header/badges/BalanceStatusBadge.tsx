import type { User } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";
import {
  AlertCircle,
  Loader2,
  Minus,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useCurrency } from "~/hooks/useCurrency";
import { useRouteUser } from "~/hooks/useRouteUser";
import { getUserByEmailServer } from "~/lib/api/user/get-user-by-email";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import type { ApiResponse } from "~/types/ApiResponse";

import { BadgeIcon, HeaderBadge } from "./HeaderBadge";

interface BalanceStatusBadgeProps {
  animate?: boolean;
  className?: string;
  compact?: boolean;
  fullWidth?: boolean;
  isActive?: boolean;
  showAmount?: boolean;
  showIcon?: boolean;
}

type BalanceStatus = "surplus" | "balanced" | "deficit" | "loading" | "error";

const statusConfig = {
  balanced: {
    color: "bg-secondary",
    description: "Your balance is at zero.",
    icon: Minus,
    iconColor: "text-secondary-foreground",
    label: "Balanced",
    variant: "secondary" as const,
  },
  deficit: {
    color: "bg-destructive",
    description: "Your balance is negative.",
    icon: TrendingDown,
    iconColor: "text-destructive",
    label: "Deficit",
    variant: "destructive" as const,
  },
  error: {
    color: "bg-destructive",
    description: "Failed to load balance.",
    icon: AlertCircle,
    iconColor: "text-destructive-foreground",
    label: "Error",
    variant: "destructive" as const,
  },
  loading: {
    color: "bg-muted",
    description: "Fetching balance information.",
    icon: Loader2,
    iconColor: "text-muted-foreground",
    label: "Loading...",
    variant: "outline" as const,
  },
  surplus: {
    color: "bg-primary",
    description: "Your balance is positive.",
    icon: TrendingUp,
    iconColor: "text-primary",
    label: "Surplus",
    variant: "secondary" as const,
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
  const { formatPlain } = useCurrency();

  const { error, isPending, data } = useQuery<ApiResponse<User | null>>({
    enabled: Boolean(userEmail && isActive),
    gcTime: 1000 * 60 * 10,
    queryFn: () => getUserByEmailServer({ data: { email: userEmail } }),
    queryKey: [queryDictionary.user, userEmail],
    refetchOnWindowFocus: false,
    retry: 1,
    retryDelay: 1000,
    staleTime: 1000 * 60 * 5,
  });

  const getStatus = (): BalanceStatus => {
    if (error) {
      return "error";
    }
    if (isPending) {
      return "loading";
    }
    if (data?.error || !data?.data) {
      return "error";
    }

    const balance = data.data.totalBalance;
    if (balance === undefined || balance === null) {
      return "error";
    }
    if (balance > 0) {
      return "surplus";
    }
    if (balance < 0) {
      return "deficit";
    }
    return "balanced";
  };

  const status = getStatus();
  const config = statusConfig[status];
  const balance = data?.data?.totalBalance ?? 0;

  if (!userEmail) {
    return null;
  }

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
        />
      }
    >
      {showIcon ? (
        <BadgeIcon
          icon={config.icon}
          className={config.iconColor}
          fullWidth={fullWidth}
          animate={animate && status === "loading"}
        />
      ) : null}

      <span className="font-medium text-xs">
        {config.label}
        {showAmount && status !== "loading" && status !== "error" && (
          <span className="ml-1.5 font-mono">{formatPlain(balance)}</span>
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
}: {
  config: (typeof statusConfig)[keyof typeof statusConfig];
  status: BalanceStatus;
  balance: number;
  error: Error | null;
}) {
  const { formatPlain } = useCurrency();

  return (
    <div className="space-y-1">
      <div className="flex items-center gap-2">
        <span className={cn("h-1.5 w-1.5 rounded-full", config.color)} />
        <span className="font-semibold text-xs">
          Balance Status: {config.label}
        </span>
      </div>
      <p className="text-[10px]">{config.description}</p>

      {status !== "loading" && status !== "error" && (
        <div className="mt-1 border-border border-t pt-1">
          <div className="flex items-center justify-between gap-4 text-[10px]">
            <span>Current balance:</span>
            <span className={cn("font-mono font-semibold")}>
              {formatPlain(balance)}
            </span>
          </div>
        </div>
      )}

      {error ? (
        <p className="mt-1 border-border border-t pt-1 text-[10px] text-destructive">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      ) : null}
    </div>
  );
}
