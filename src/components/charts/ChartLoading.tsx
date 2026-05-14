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
          <Loader2 className="text-primary size-8 animate-spin" />
          <span className="text-muted-foreground text-sm font-medium">
            {message}
          </span>
        </div>
      )}
    </div>
  );
}

interface ChartErrorProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ChartError({
  title = "Error loading chart",
  message,
  onRetry,
}: ChartErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 py-12">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="bg-destructive/10 flex size-12 items-center justify-center rounded-full">
          <div className="bg-destructive size-6 rounded-full" />
        </div>
        <div>
          <p className="text-destructive font-medium">{title}</p>
          {message && (
            <p className="text-muted-foreground mt-1 text-sm">{message}</p>
          )}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-3 py-2 text-sm transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
