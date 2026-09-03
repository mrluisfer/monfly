import { ChevronDownIcon, PlusCircleIcon } from "lucide-react";
import { useState } from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";
import { useAddCard } from "~/hooks/cards";

import { CardForm } from "./CardForm";

export default function AddCard() {
  const [open, setOpen] = useState(false);
  const { form, onSubmit, mutation } = useAddCard(() => setOpen(false));
  const isLoading = mutation.status === "pending";

  return (
    <Collapsible
      open={open}
      onOpenChange={setOpen}
      render={<Card />}
      className={"p-0"}
    >
      {/* Default Trigger render is a <button>, so aria-expanded and keyboard
          activation come for free — hence the card header styles live here. */}
      <CollapsibleTrigger className="group mx-(--card-spacing) flex items-center gap-2.5 rounded-md py-[24px] text-left outline-none focus-visible:ring-3 focus-visible:ring-ring/50">
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-4xl bg-primary/10"
        >
          <PlusCircleIcon className="size-4.5 text-primary" />
        </span>
        <div className="min-w-0">
          <CardTitle>New card</CardTitle>
          <CardDescription>
            Add a card or account to track its balance separately.
          </CardDescription>
        </div>
        <ChevronDownIcon className="ml-auto size-4 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180 motion-reduce:transition-none" />
      </CollapsibleTrigger>
      {/* Height animation driven by Base UI's own CSS var, same as ui/accordion. */}
      <CollapsibleContent className="h-(--collapsible-panel-height) overflow-hidden transition-[height] duration-250 ease-in-out data-ending-style:h-0 data-starting-style:h-0 motion-reduce:transition-none">
        <CardContent>
          <CardForm
            form={form}
            onSubmit={onSubmit}
            submitText="Create card"
            pendingText="Creating…"
            isLoading={isLoading}
          />
        </CardContent>
      </CollapsibleContent>
    </Collapsible>
  );
}
