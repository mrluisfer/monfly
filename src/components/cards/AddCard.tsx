import { PlusCircleIcon } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { useAddCard } from "~/hooks/cards";

import { CardForm } from "./CardForm";

export default function AddCard() {
  const { form, onSubmit, mutation } = useAddCard();
  const isLoading = mutation.status === "pending";

  return (
    <Card>
      <CardHeader className="flex flex-row items-center gap-2.5 space-y-0">
        <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-4xl">
          <PlusCircleIcon className="text-primary size-4.5" />
        </div>
        <div className="min-w-0 text-left">
          <CardTitle>New card</CardTitle>
          <CardDescription>
            Add a card or account to track its balance separately.
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <CardForm
          form={form}
          onSubmit={onSubmit}
          submitText="Create card"
          pendingText="Creating…"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  );
}
