import {
  CalendarIcon,
  ChevronDownIcon,
  CircleDollarSignIcon,
  FileTextIcon,
  PlusCircleIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import { useState } from "react";
import { Controller } from "react-hook-form";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { type LoanDirection } from "~/constants/loan-status";
import { useAddLoan } from "~/hooks/loans/useAddLoan";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { cn } from "~/lib/utils";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";

import { DebtorCombobox } from "./DebtorCombobox";
import { LoanDirectionIcon } from "./LoanDirectionIcon";
import { LoanField } from "./LoanField";
import { fromDateInputValue, toDateInputValue } from "./date-input";

/** Collapsible form to register a new loan (money owed to or by the user). */
export function AddLoanCard() {
  const { form, onSubmit, mutation } = useAddLoan();
  const isLoading = mutation.status === "pending";
  const errors = form.formState.errors;
  const currency = usePreferredCurrency();
  const [openCollapsible, setOpenCollapsible] = useState(false);

  return (
    <Collapsible
      className="flex flex-col gap-2"
      aria-labelledby="add-loan-heading"
      open={openCollapsible}
      onOpenChange={setOpenCollapsible}
    >
      <CollapsibleTrigger
        render={
          <Button
            variant={"ghost"}
            className="group bg-card border-border/60 flex h-16 items-center gap-3 p-3"
            size={"lg"}
          />
        }
      >
        <span
          aria-hidden="true"
          className="bg-primary/10 text-primary flex size-9 shrink-0 items-center justify-center rounded-xl"
        >
          <PlusCircleIcon className="size-4" />
        </span>
        <div>
          <h2
            id="add-loan-heading"
            className="text-left text-sm font-semibold tracking-tight select-none"
          >
            New loan
          </h2>
          <p className="text-muted-foreground text-xs select-none">
            Register a debt someone owes you.
          </p>
        </div>
        <ChevronDownIcon
          className={cn(
            "ml-auto transition-transform group-data-[state=open]:rotate-180",
            openCollapsible ? "rotate-180" : "rotate-0",
          )}
        />
      </CollapsibleTrigger>

      <CollapsibleContent className={"bg-card rounded-4xl border py-3"}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-1 md:px-2"
          noValidate
        >
          <Controller
            control={form.control}
            name="direction"
            render={({ field }) => (
              <Tabs
                value={field.value}
                onValueChange={(v) => field.onChange(v as LoanDirection)}
                className="w-full"
              >
                <TabsList className="w-full md:w-fit">
                  <TabsTrigger value="lent" className="flex-1 gap-1.5">
                    <LoanDirectionIcon direction="lent" className="size-3.5" />
                    Owed to me
                  </TabsTrigger>
                  <TabsTrigger value="borrowed" className="flex-1 gap-1.5">
                    <LoanDirectionIcon
                      direction="borrowed"
                      className="size-3.5"
                    />
                    I owe
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          />

          {/* Main inputs: stack on mobile, 4-column grid on md+ so debtor/amount/dates fit a single row. */}
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2 2xl:grid-cols-4">
            <LoanField
              label={
                form.watch("direction") === "borrowed" ? "Creditor" : "Debtor"
              }
              error={errors.debtor?.message}
              icon={<UserIcon className="size-3.5" />}
            >
              <Controller
                control={form.control}
                name="debtor"
                render={({ field }) => (
                  <DebtorCombobox
                    name={field.name}
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    placeholder="e.g. Juan, SAT, Insurance Co."
                  />
                )}
              />
            </LoanField>

            <LoanField
              label={`Amount (${currency})`}
              error={errors.amount?.message}
              icon={<CircleDollarSignIcon className="size-3.5" />}
            >
              <Controller
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    inputMode="decimal"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                )}
              />
            </LoanField>

            <LoanField
              label="Issued at"
              icon={<CalendarIcon className="size-3.5" />}
            >
              <Controller
                control={form.control}
                name="issuedAt"
                render={({ field }) => (
                  <Input
                    type="date"
                    value={toDateInputValue(field.value)}
                    onChange={(e) =>
                      field.onChange(fromDateInputValue(e.target.value))
                    }
                  />
                )}
              />
            </LoanField>

            <LoanField
              label="Due (optional)"
              icon={<CalendarIcon className="size-3.5" />}
            >
              <Controller
                control={form.control}
                name="dueAt"
                render={({ field }) => (
                  <Input
                    type="date"
                    value={toDateInputValue(field.value ?? null)}
                    onChange={(e) =>
                      field.onChange(fromDateInputValue(e.target.value))
                    }
                  />
                )}
              />
            </LoanField>
          </div>

          {/* Notes + submit row. Notes take the available space, the button stays
              compact and right-aligned on md+, so the form ends in a clean line. */}
          <div className="flex flex-col gap-3 md:flex-row md:items-end">
            <div className="md:flex-1">
              <LoanField
                label="Notes (optional)"
                icon={<FileTextIcon className="size-3.5" />}
              >
                <Controller
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Context, agreement, etc."
                    />
                  )}
                />
              </LoanField>
            </div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full md:w-auto md:shrink-0"
            >
              {isLoading ? (
                <>
                  <Spinner className="animate-spin" />
                  Saving…
                </>
              ) : (
                <>
                  <PlusIcon />
                  Create loan
                </>
              )}
            </Button>
          </div>
        </form>
      </CollapsibleContent>
    </Collapsible>
  );
}
