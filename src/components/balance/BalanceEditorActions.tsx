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
        aria-label="Cancel editing"
      >
        <X size={12} />
      </Button>
      <Button
        variant="default"
        size="icon"
        type="button"
        onClick={onSave}
        disabled={isSubmitting}
        aria-label="Save balance"
      >
        {isSubmitting ? (
          <Loader2 size={12} className="animate-spin" />
        ) : (
          <Check size={12} />
        )}
      </Button>
    </>
  );
}
