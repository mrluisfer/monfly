import {
  CheckCircle2Icon,
  CircleAlertIcon,
  DownloadIcon,
  LoaderIcon,
  SaveIcon,
  TrashIcon,
} from "lucide-react";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "~/components/ui/alert-dialog";
import { Button } from "~/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { cn } from "~/lib/utils";

interface UserFormActionsProps {
  submitting: boolean;
  hasChanges: boolean;
  onExport?: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
}

export function UserFormActions({
  submitting,
  hasChanges,
  onExport,
  onDelete,
}: UserFormActionsProps) {
  const [exporting, setExporting] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const runExport = async () => {
    if (!onExport || exporting) return;
    setExporting(true);
    try {
      await onExport();
    } finally {
      setExporting(false);
    }
  };

  const runDelete = async () => {
    if (!onDelete || deleting) return;
    setDeleting(true);
    try {
      await onDelete();
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div
      className={cn(
        "sticky bottom-3 z-30 mt-6",
        "border-border/60 bg-background/75 ring-foreground/5 rounded-2xl border px-3 py-2.5 shadow-[0_22px_36px_-30px_rgba(2,6,23,0.55)] ring-1 backdrop-blur-md",
        "supports-backdrop-filter:bg-background/65",
      )}
    >
      <div className="grid gap-3 sm:flex sm:items-center sm:justify-between">
        <div className="order-2 flex flex-wrap items-center gap-2 sm:order-1">
          <StatusPill hasChanges={hasChanges} submitting={submitting} />
        </div>

        <div className="order-1 flex flex-wrap items-center gap-2 sm:order-2 sm:justify-end">
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  onClick={runExport}
                  disabled={exporting}
                  className="text-muted-foreground hover:text-foreground"
                >
                  {exporting ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    <DownloadIcon />
                  )}
                  <span className="hidden sm:inline">
                    {exporting ? "Preparing…" : "Export my data"}
                  </span>
                </Button>
              }
            />
            <TooltipContent sideOffset={8}>
              Download a copy of your transactions, categories and reports (GDPR
              / CCPA portability).
            </TooltipContent>
          </Tooltip>

          <AlertDialog>
            <AlertDialogTrigger
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  disabled={deleting}
                  className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  {deleting ? (
                    <LoaderIcon className="animate-spin" />
                  ) : (
                    <TrashIcon />
                  )}
                  <span className="hidden sm:inline">Delete account</span>
                </Button>
              }
            />
            <AlertDialogContent>
              <AlertDialogHeader>
                <span
                  data-slot="alert-dialog-media"
                  className="bg-destructive/10 text-destructive mb-2 inline-flex size-16 items-center justify-center rounded-full"
                  aria-hidden="true"
                >
                  <CircleAlertIcon />
                </span>
                <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                <AlertDialogDescription>
                  This permanently removes your workspace, transactions,
                  budgets, categories and reports. This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel render={<Button variant="outline" />}>
                  Cancel
                </AlertDialogCancel>
                <AlertDialogAction
                  render={<Button variant="destructive" onClick={runDelete} />}
                >
                  <TrashIcon />
                  Yes, delete forever
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <span
            aria-hidden="true"
            className="bg-border/60 hidden h-6 w-px sm:inline-block"
          />

          <Button
            type="submit"
            size="sm"
            className="min-w-32"
            disabled={submitting || !hasChanges}
          >
            {submitting ? (
              <LoaderIcon className="animate-spin" aria-hidden="true" />
            ) : (
              <SaveIcon aria-hidden="true" />
            )}
            {submitting ? "Saving…" : "Save changes"}
          </Button>
        </div>
      </div>
    </div>
  );
}

function StatusPill({
  hasChanges,
  submitting,
}: {
  hasChanges: boolean;
  submitting: boolean;
}) {
  if (submitting) {
    return (
      <span
        className="bg-primary/10 text-primary inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium"
        aria-live="polite"
      >
        <LoaderIcon className="size-3 animate-spin" aria-hidden="true" />
        Saving changes…
      </span>
    );
  }

  if (hasChanges) {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-300">
        <CircleAlertIcon className="size-3" aria-hidden="true" />
        Unsaved changes
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
      <CheckCircle2Icon className="size-3" aria-hidden="true" />
      All changes saved
    </span>
  );
}
