import { Loader2 } from "lucide-react";

import { Skeleton } from "@/components/ui/skeleton";

interface ChartLoadingProps {
  message?: string;
  showSkeleton?: boolean;
}

export function ChartLoading({
  message = "Loading chart...",
  showSkeleton = true,
}: ChartLoadingProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      {showSkeleton ? (
        <div className="w-full space-y-3">
          <div className="mb-6 flex items-center gap-4">
            <Skeleton className="size-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="flex items-center justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-8 animate-spin text-primary" />
          <span className="font-medium text-muted-foreground text-sm">
            {message}
          </span>
        </div>
      )}
    </div>
  );
}

interface ChartErrorProps {
  message?: string;
  onRetry?: () => void;
  title?: string;
}

export function ChartError({
  title = "Error loading chart",
  message,
  onRetry,
}: ChartErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex size-12 items-center justify-center rounded-full bg-destructive/10">
          <div className="size-6 rounded-full bg-destructive" />
        </div>
        <div>
          <p className="font-medium text-destructive">{title}</p>
          {message ? (
            <p className="mt-1 text-muted-foreground text-sm">{message}</p>
          ) : null}
        </div>
        {onRetry ? (
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md bg-primary px-3 py-2 text-primary-foreground text-sm transition-colors hover:bg-primary/90"
          >
            Try Again
          </button>
        ) : null}
      </div>
    </div>
  );
}
