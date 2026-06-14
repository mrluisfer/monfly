import { Controller } from "react-hook-form";
import { PlusCircleIcon } from "lucide-react";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { useAddCard } from "~/hooks/cards";

export default function AddCard() {
  const { form, onSubmit, mutation } = useAddCard();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid gap-4 sm:grid-cols-2"
        >
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-sm font-medium" htmlFor="card-name">
              Name
            </label>
            <Controller
              control={control}
              name="name"
              render={({ field }) => (
                <Input
                  id="card-name"
                  placeholder="e.g. Personal debit"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
            {errors.name && (
              <p className="text-destructive text-xs">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="card-provider">
              Provider
            </label>
            <Controller
              control={control}
              name="provider"
              render={({ field }) => (
                <Input
                  id="card-provider"
                  placeholder="e.g. Visa, BBVA"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="card-last4">
              Last 4 digits
            </label>
            <Controller
              control={control}
              name="last4"
              render={({ field }) => (
                <Input
                  id="card-last4"
                  inputMode="numeric"
                  maxLength={4}
                  placeholder="1234"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
            {errors.last4 && (
              <p className="text-destructive text-xs">{errors.last4.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="card-balance">
              Opening balance
            </label>
            <Controller
              control={control}
              name="balance"
              render={({ field }) => (
                <Input
                  id="card-balance"
                  inputMode="decimal"
                  placeholder="0.00"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
            {errors.balance && (
              <p className="text-destructive text-xs">
                {errors.balance.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium" htmlFor="card-type">
              Type
            </label>
            <Controller
              control={control}
              name="type"
              render={({ field }) => (
                <Input
                  id="card-type"
                  placeholder="debit / credit / cash"
                  {...field}
                  value={field.value ?? ""}
                />
              )}
            />
          </div>

          <div className="flex items-end sm:col-span-2">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? "Creating…" : "Create card"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
