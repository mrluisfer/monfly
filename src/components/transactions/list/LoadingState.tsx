import { Spinner } from "~/components/ui/spinner";

export function LoadingState({ message }: { message: string }) {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Spinner className="size-4" />
        {message}
      </div>
    </div>
  );
}
