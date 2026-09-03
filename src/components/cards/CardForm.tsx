import { CheckIcon } from "lucide-react";
import { useId } from "react";
import type { UseFormReturn } from "react-hook-form";

import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import {
  CARD_COLORS,
  CARD_TYPE_LABEL,
  CARD_TYPES,
} from "~/constants/card-status";
import { cn } from "~/lib/utils";
import type { CardFormValues } from "~/zod-schemas/card-schema";
import { Form, FormField } from "../ui/form";

interface CardFormProps {
  form: UseFormReturn<CardFormValues>;
  isLoading?: boolean;
  onSubmit: (values: CardFormValues) => void;
  pendingText: string;
  submitText: string;
}

/**
 * Presentational card form shared by the create flow ({@link AddCard}) and the
 * edit dialog ({@link EditCard}). The owning component supplies the RHF form and
 * submit handler, so validation/persistence logic stays in the hooks.
 */
export function CardForm({
  form,
  onSubmit,
  submitText,
  pendingText,
  isLoading = false,
}: CardFormProps) {
  const uid = useId();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = form;

  const submitLabel = isLoading ? pendingText : submitText;

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid gap-4 sm:grid-cols-2"
      >
        <div className="space-y-1.5 sm:col-span-2">
          <label className="font-medium text-sm" htmlFor={`${uid}-name`}>
            Name
          </label>
          <FormField
            control={control}
            name="name"
            render={({ field }) => (
              <Input
                id={`${uid}-name`}
                placeholder="e.g. Personal debit"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
          {errors.name ? (
            <p className="text-destructive text-xs">{errors.name.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="font-medium text-sm" htmlFor={`${uid}-provider`}>
            Provider
          </label>
          <FormField
            control={control}
            name="provider"
            render={({ field }) => (
              <Input
                id={`${uid}-provider`}
                placeholder="e.g. Visa, BBVA"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
        </div>

        <div className="space-y-1.5">
          <label className="font-medium text-sm" htmlFor={`${uid}-last4`}>
            Last 4 digits
          </label>
          <FormField
            control={control}
            name="last4"
            render={({ field }) => (
              <Input
                id={`${uid}-last4`}
                inputMode="numeric"
                maxLength={4}
                placeholder="1234"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
          {errors.last4 ? (
            <p className="text-destructive text-xs">{errors.last4.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="font-medium text-sm" htmlFor={`${uid}-balance`}>
            Balance
          </label>
          <FormField
            control={control}
            name="balance"
            render={({ field }) => (
              <Input
                id={`${uid}-balance`}
                inputMode="decimal"
                placeholder="0.00"
                {...field}
                value={field.value ?? ""}
              />
            )}
          />
          {errors.balance ? (
            <p className="text-destructive text-xs">{errors.balance.message}</p>
          ) : null}
        </div>

        <div className="space-y-1.5">
          <label className="font-medium text-sm" htmlFor={`${uid}-type`}>
            Type
          </label>
          <FormField
            control={control}
            name="type"
            render={({ field }) => (
              <Select
                value={field.value ?? null}
                onValueChange={(val) => field.onChange(val)}
              >
                <SelectTrigger
                  id={`${uid}-type`}
                  className="w-full justify-between bg-input/50"
                >
                  <SelectValue placeholder="Select a type">
                    {(value: unknown) =>
                      typeof value === "string" && value
                        ? (CARD_TYPE_LABEL[
                            value as keyof typeof CARD_TYPE_LABEL
                          ] ?? value)
                        : "Select a type"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent alignItemWithTrigger={false}>
                  {CARD_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {CARD_TYPE_LABEL[type]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <span className="font-medium text-sm">Accent color</span>
          <FormField
            control={control}
            name="color"
            render={({ field }) => (
              <div className="flex flex-wrap items-center gap-2">
                {/* No color (theme default) */}
                <button
                  type="button"
                  onClick={() => field.onChange(null)}
                  aria-label="No accent color"
                  aria-pressed={!field.value}
                  className={cn(
                    "flex size-7 items-center justify-center rounded-full border border-border border-dashed text-[10px] text-muted-foreground transition-transform hover:scale-110",
                    !field.value && "ring-2 ring-ring/40 ring-offset-2",
                  )}
                >
                  {!field.value && <CheckIcon className="size-3.5" />}
                </button>
                {CARD_COLORS.map((color) => {
                  const selected = field.value === color;
                  return (
                    <button
                      key={color}
                      type="button"
                      onClick={() => field.onChange(color)}
                      aria-label={`Accent color ${color}`}
                      aria-pressed={selected}
                      style={{ backgroundColor: color }}
                      className={cn(
                        "flex size-7 items-center justify-center rounded-full ring-offset-background transition-transform hover:scale-110",
                        selected && "ring-2 ring-foreground/40 ring-offset-2",
                      )}
                    >
                      {selected && (
                        <CheckIcon className="size-3.5 text-white" />
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>

        <div className="flex items-end sm:col-span-2">
          <Button type="submit" disabled={isLoading} className="w-full">
            {submitLabel}
          </Button>
        </div>
      </form>
    </Form>
  );
}
