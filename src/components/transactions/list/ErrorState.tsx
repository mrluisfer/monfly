import { Button } from "~/components/ui/button";

export function ErrorState({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="text-center">
        <p className="font-medium text-destructive">
          Failed to load transactions
        </p>
        <p className="text-sm text-muted-foreground mt-1">{error.message}</p>
      </div>
      <Button onClick={onRetry} variant="outline" size="lg">
        Retry
      </Button>
    </div>
  );
}
