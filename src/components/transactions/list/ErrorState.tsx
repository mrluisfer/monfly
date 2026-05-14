import { Button } from "~/components/ui/button";

export function ErrorState({
  error,
  onRetry,
}: {
  error: Error;
  onRetry: () => void;
}) {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 p-8">
      <div className="text-center">
        <p className="text-destructive font-medium">
          Failed to load transactions
        </p>
        <p className="text-muted-foreground mt-1 text-sm">{error.message}</p>
      </div>
      <Button onClick={onRetry} variant="outline" size="lg">
        Retry
      </Button>
    </div>
  );
}
