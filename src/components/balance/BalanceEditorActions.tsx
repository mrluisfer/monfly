import { Button } from "~/components/ui/button";
import { Check, Loader2, X } from "lucide-react";

interface BalanceEditorActionsProps {
  onSave: () => void;
  onCancel: () => void;
  isSubmitting?: boolean;
}

export function BalanceEditorActions({
  onSave,
  onCancel,
  isSubmitting,
}: BalanceEditorActionsProps) {
  return (
    <>
      <Button
        onClick={onCancel}
        variant="secondary"
        size="icon"
        disabled={isSubmitting}
        className="
          h-9 w-9 border border-border/80 text-foreground sm:h-10 sm:w-10
          transition-all duration-200 ease-out
          hover:scale-105 hover:bg-secondary/80
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          dark:hover:bg-secondary/60
          focus-visible:ring-2 focus-visible:ring-ring
        "
        aria-label="Cancel editing"
      >
        <X
          size={14}
          className="transition-transform duration-200 hover:rotate-90"
        />
      </Button>
      <Button
        variant="default"
        size="icon"
        type="button"
        onClick={onSave}
        disabled={isSubmitting}
        className="
          h-9 w-9 sm:h-10 sm:w-10
          transition-all duration-200 ease-out
          hover:scale-105 hover:shadow-md
          active:scale-95
          disabled:opacity-50 disabled:cursor-not-allowed
          dark:hover:shadow-lg dark:hover:shadow-primary/25
          focus-visible:ring-2 focus-visible:ring-ring
        "
        aria-label="Save balance"
      >
        {isSubmitting ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Check
            size={14}
            className="transition-transform duration-200 hover:scale-110"
          />
        )}
      </Button>
    </>
  );
}
