import type { Card } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import { useState } from "react";

import { Button } from "~/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "~/components/ui/tooltip";
import { useEditCard } from "~/hooks/cards";

import { CardForm } from "./CardForm";

export function EditCard({ card }: { card: Card }) {
  const [open, setOpen] = useState(false);
  const { form, onSubmit, mutation } = useEditCard(card, {
    onSuccess: () => setOpen(false),
  });

  // Reset back to the card's values whenever the dialog (re)opens so a
  // cancelled edit doesn't leak into the next one.
  const handleOpenChange = (next: boolean) => {
    if (next) form.reset();
    setOpen(next);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <Tooltip>
        <TooltipTrigger
          render={
            <DialogTrigger
              render={
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label={`Edit ${card.name}`}
                >
                  <PencilIcon className="size-4" aria-hidden="true" />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Edit card</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit card</DialogTitle>
          <DialogDescription>
            Update the details of “{card.name}”. Changing the balance adjusts
            your total accordingly.
          </DialogDescription>
        </DialogHeader>
        <CardForm
          form={form}
          onSubmit={onSubmit}
          submitText="Save changes"
          pendingText="Saving…"
          isLoading={mutation.status === "pending"}
        />
      </DialogContent>
    </Dialog>
  );
}
