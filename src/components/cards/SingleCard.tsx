import {Card as CardType} from "@prisma/client";
import {Card} from "@/components/ui/card";
import {cn} from "@/lib/utils";
import {CARD_TYPE_LABEL} from "@/constants/card-status";
import {ArchiveIcon, ArchiveRestoreIcon, CreditCardIcon, Trash2Icon} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {EditCard} from "@/components/cards/EditCard";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {Button} from "@/components/ui/button";
import {useDeleteCard, usePreferredCurrency, useUpdateCard} from "@/hooks";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from "@/components/ui/alert-dialog";
import {formatCurrency} from "@/utils/format-currency";

export function SingleCard({card}: { card: CardType }) {
  const isArchived = card.status === "archived";
  const accent = card.color ?? "var(--primary)";
  const typeLabel = card.type
    ? (CARD_TYPE_LABEL[card.type as keyof typeof CARD_TYPE_LABEL] ??
      card.type)
    : null;
  const meta =
    [card.provider, card.last4 ? `•••• ${card.last4}` : null]
      .filter(Boolean)
      .join(" · ") || "—";

  const {archive, restore} = useUpdateCard();
  const currency = usePreferredCurrency();
  const {remove} = useDeleteCard();

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
        style={{backgroundColor: accent}}
      />

      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
                <span
                  aria-hidden="true"
                  className="flex size-11 shrink-0 items-center justify-center rounded-xl ring-1"
                  style={{
                    backgroundColor: `color-mix(in oklch, ${accent} 14%, transparent)`,
                    color: accent,
                    boxShadow: `inset 0 0 0 1px color-mix(in oklch, ${accent} 22%, transparent)`,
                  }}
                >
                  <CreditCardIcon className="size-5"/>
                </span>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <p className="truncate font-semibold">{card.name}</p>
              {typeLabel && (
                <Badge variant="secondary" className="shrink-0">
                  {typeLabel}
                </Badge>
              )}
              {isArchived && (
                <Badge variant="outline" className="shrink-0">
                  Archived
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-0.5 truncate text-sm">
              {meta}
            </p>
          </div>
        </div>

        {/* Actions: subtle by default, emphasized on hover/focus. */}
        <div
          className="flex shrink-0 items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <EditCard card={card}/>

          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={isArchived ? "Restore card" : "Archive card"}
                  onClick={() =>
                    isArchived ? restore(card.id) : archive(card.id)
                  }
                >
                  {isArchived ? (
                    <ArchiveRestoreIcon className="size-4"/>
                  ) : (
                    <ArchiveIcon className="size-4"/>
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
                        <Trash2Icon className="size-4" aria-hidden="true"/>
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
                <AlertDialogAction onClick={() => remove(card.id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="mt-auto">
        <p className="text-muted-foreground text-[0.7rem] font-semibold tracking-[0.13em] uppercase">
          Balance
        </p>
        <p className="mt-0.5 text-2xl font-semibold tracking-tight tabular-nums">
          {formatCurrency(card.balance ?? 0, currency)}
        </p>
      </div>
    </Card>
  );
}
