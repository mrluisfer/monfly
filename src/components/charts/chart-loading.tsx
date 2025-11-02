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
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      {showSkeleton ? (
        <div className="w-full space-y-3">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-4 w-4 rounded-full" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-16" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-32 w-full rounded-lg" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-3 w-14" />
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="text-sm text-muted-foreground font-medium">
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
    <div className="flex flex-col items-center justify-center py-12 space-y-4">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center">
          <div className="w-6 h-6 rounded-full bg-destructive" />
        </div>
        <div>
          <p className="font-medium text-destructive">{title}</p>
          {message && (
            <p className="text-sm text-muted-foreground mt-1">{message}</p>
          )}
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}
