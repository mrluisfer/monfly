import type { Card as CardType } from "@prisma/client";
import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  CreditCardIcon,
  Trash2Icon,
} from "lucide-react";
import { useCallback } from "react";
import { EditCard } from "@/components/cards/EditCard";
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
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { CARD_TYPE_LABEL } from "@/constants/card-status";
import { useCurrency, useDeleteCard, useUpdateCard } from "@/hooks";
import { cn } from "@/lib/utils";

export function SingleCard({ card }: { card: CardType }) {
  const isArchived = card.status === "archived";
  const accent = card.color ?? "var(--primary)";
  const typeLabel = card.type
    ? (CARD_TYPE_LABEL[card.type as keyof typeof CARD_TYPE_LABEL] ?? card.type)
    : null;
  const meta =
    [card.provider, card.last4 ? `•••• ${card.last4}` : null]
      .filter(Boolean)
      .join(" · ") || "—";

  const { archive, restore } = useUpdateCard();
  const { format: formatAmount } = useCurrency();
  const { remove } = useDeleteCard();

  const removeCard = useCallback(() => remove(card.id), [card.id, remove]);
  const archiveRestoreCard = useCallback(
    () => (isArchived ? restore(card.id) : archive(card.id)),
    [isArchived, restore, archive, card.id],
  );

  return (
    <Card
      key={card.id}
      className={cn(
        "group relative flex flex-col gap-4 overflow-hidden rounded-2xl p-5 transition-all hover:shadow-md",
        isArchived && "opacity-65",
      )}
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full opacity-15 blur-2xl"
        style={{ backgroundColor: accent }}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span
            aria-hidden="true"
            className="flex size-11 shrink-0 items-center justify-center rounded-xl ring-1"
            style={{
              backgroundColor: `color-mix(in oklch, ${accent} 14%, transparent)`,
              boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${accent} 22%, transparent)`,
              color: accent,
            }}
          >
            <CreditCardIcon className="size-5" />
          </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold">{card.name}</p>
              {typeLabel ? (
                <Badge variant="secondary" className="shrink-0">
                  {typeLabel}
                </Badge>
              ) : null}
              {isArchived && (
                <Badge variant="outline" className="shrink-0">
                  Archived
                </Badge>
              )}
            </div>
            <p className="mt-0.5 truncate text-muted-foreground text-sm">
              {meta}
            </p>
          </div>
        </div>

        {/* Actions: subtle by default, emphasized on hover/focus. */}
        <div className="flex shrink-0 items-center gap-1 opacity-70 transition-opacity focus-within:opacity-100 group-hover:opacity-100">
          <EditCard card={card} />

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={isArchived ? "Restore card" : "Archive card"}
                  onClick={archiveRestoreCard}
                >
                  {isArchived ? (
                    <ArchiveRestoreIcon className="size-4" />
                  ) : (
                    <ArchiveIcon className="size-4" />
                  )}
                </Button>
              }
            />
            <TooltipContent>
              {isArchived ? "Restore card" : "Archive card"}
            </TooltipContent>
          </Tooltip>

          <AlertDialog>
            <Tooltip>
              <TooltipTrigger
                render={
                  <AlertDialogTrigger
                    render={
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        aria-label="Delete card"
                      >
                        <Trash2Icon className="size-4" aria-hidden="true" />
                      </Button>
                    }
                  />
                }
              />
              <TooltipContent>Delete card</TooltipContent>
            </Tooltip>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this card?</AlertDialogTitle>
                <AlertDialogDescription>
                  Transactions linked to “{card.name}” won’t be deleted —
                  they’ll move back to the “All cards” view. This can’t be
                  undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={removeCard}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-auto">
        <p className="font-semibold text-[0.7rem] text-muted-foreground uppercase tracking-[0.13em]">
          Balance
        </p>
        <p className="mt-0.5 font-semibold text-2xl tabular-nums tracking-tight">
          {formatAmount(card.balance ?? 0)}
        </p>
      </div>
    </Card>
  );
}
