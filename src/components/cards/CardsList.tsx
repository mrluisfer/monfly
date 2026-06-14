import {
  ArchiveIcon,
  ArchiveRestoreIcon,
  CreditCardIcon,
  Trash2Icon,
} from "lucide-react";

import { DataNotFoundPlaceholder } from "~/components/shared/DataNotFoundPlaceholder";
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
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Skeleton } from "~/components/ui/skeleton";
import { useCards, useDeleteCard, useUpdateCard } from "~/hooks/cards";
import { formatCurrency } from "~/utils/format-currency";

export function CardsList() {
  const { data, isPending } = useCards();
  const { remove } = useDeleteCard();
  const { archive, restore } = useUpdateCard();

  const cards = data?.data ?? [];

  if (isPending) {
    return (
      <div className="grid gap-3 sm:grid-cols-2">
        {[1, 2].map((i) => (
          <Skeleton key={i} className="h-24 rounded-2xl" />
        ))}
      </div>
    );
  }

  if (cards.length === 0) {
    return (
      <DataNotFoundPlaceholder>
        No cards yet. Create one above to start tracking balances per card.
      </DataNotFoundPlaceholder>
    );
  }

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {cards.map((card) => {
        const isArchived = card.status === "archived";
        return (
          <Card key={card.id} className="rounded-2xl">
            <CardContent className="flex items-center justify-between gap-4 p-4">
              <div className="flex min-w-0 items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-xl">
                  <CreditCardIcon className="size-5" aria-hidden="true" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium">{card.name}</p>
                    {isArchived && (
                      <Badge variant="outline" className="shrink-0">
                        Archived
                      </Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground truncate text-sm">
                    {[card.provider, card.last4 ? `•••• ${card.last4}` : null]
                      .filter(Boolean)
                      .join(" · ") || "—"}
                  </p>
                  <p className="mt-0.5 text-sm font-semibold">
                    {formatCurrency(card.balance ?? 0, "USD")}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={isArchived ? "Restore card" : "Archive card"}
                  onClick={() =>
                    isArchived ? restore(card.id) : archive(card.id)
                  }
                >
                  {isArchived ? (
                    <ArchiveRestoreIcon className="size-4" />
                  ) : (
                    <ArchiveIcon className="size-4" />
                  )}
                </Button>

                <AlertDialog>
                  <AlertDialogTrigger
                    render={
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        aria-label="Delete card"
                        className="text-destructive"
                      >
                        <Trash2Icon className="size-4" aria-hidden="true" />
                      </Button>
                    }
                  />
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
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
