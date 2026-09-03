import {
  CalendarIcon,
  ChevronDownIcon,
  CircleDollarSignIcon,
  FileTextIcon,
  PlusCircleIcon,
  PlusIcon,
  UserIcon,
} from "lucide-react";
import { useCallback, useState } from "react";
import { Controller, type ControllerProps } from "react-hook-form";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Spinner } from "@/components/ui/spinner";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { LoanDirection } from "~/constants/loan-status";
import { buildLoanFormDefaults, useAddLoan } from "~/hooks/loans/useAddLoan";
import { usePreferredCurrency } from "~/hooks/usePreferredCurrency";
import { cn } from "~/lib/utils";
import type { LoanFormValues } from "~/zod-schemas/loan-schema";
import { AmountInput } from "../shared";
import { Card } from "../ui/card";
import { DebtorCombobox } from "./DebtorCombobox";
import { LoanDateInput } from "./LoanDateInput";
import { LoanDirectionIcon } from "./LoanDirectionIcon";
import { LoanField } from "./LoanField";

type LoanFieldRender = ControllerProps<LoanFormValues>["render"];

const renderDirection: LoanFieldRender = ({ field }) => (
  <Tabs
    value={field.value as LoanDirection}
    onValueChange={field.onChange}
    className="w-full"
    defaultValue="borrowed"
  >
    <TabsList className="w-full md:w-fit">
      <TabsTrigger value="lent" className="flex-1 gap-1.5">
        <LoanDirectionIcon direction="lent" className="size-3.5" />
        Owed to me
      </TabsTrigger>
      <TabsTrigger value="borrowed" className="flex-1 gap-1.5">
        <LoanDirectionIcon direction="borrowed" className="size-3.5" />I owe
      </TabsTrigger>
    </TabsList>
  </Tabs>
);

const renderDebtor: LoanFieldRender = ({ field }) => (
  <DebtorCombobox
    name={field.name}
    value={field.value as string}
    onChange={field.onChange}
    onBlur={field.onBlur}
    placeholder="e.g. Juan, SAT, Insurance Co."
  />
);

const renderAmount: LoanFieldRender = ({ field }) => (
  <AmountInput {...field} value={field.value as string} placeholder="0.00" />
);

const renderIssuedAt: LoanFieldRender = ({ field }) => (
  <LoanDateInput
    value={field.value as Date | null}
    onValueChange={field.onChange}
  />
);

const renderDueAt: LoanFieldRender = ({ field }) => (
  <LoanDateInput
    value={(field.value as Date | null) ?? null}
    onValueChange={field.onChange}
  />
);

const renderNotes: LoanFieldRender = ({ field }) => (
  <Input
    {...field}
    value={(field.value as string | null) ?? ""}
    placeholder="Context, agreement, etc."
  />
);

/** Collapsible form to register a new loan (money owed to or by the user). */
export function AddLoanCard() {
  const { form, onSubmit, mutation } = useAddLoan();
  const isLoading = mutation.status === "pending";
  const { errors } = form.formState;
  const currency = usePreferredCurrency();
  const [openCollapsible, setOpenCollapsible] = useState(false);

  const handleCancel = useCallback(() => {
    // `reset`, not `resetDefaultValues` — the latter only moves the baseline
    // used for `isDirty`/`dirtyFields` and leaves whatever the user typed on
    // screen.
    form.reset(buildLoanFormDefaults());
    setOpenCollapsible(false);
  }, [form]);

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
            className="group flex h-16 items-center gap-3 border-border/60 bg-card p-3"
            size={"lg"}
          />
        }
      >
        <span
          aria-hidden="true"
          className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary"
        >
          <PlusCircleIcon className="size-4" />
        </span>
        <div>
          <h2
            id="add-loan-heading"
            className="select-none text-left font-semibold text-sm tracking-tight"
          >
            New loan
          </h2>
          <p className="select-none text-muted-foreground text-xs">
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

      <CollapsibleContent render={<Card />}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 px-1 md:px-2"
          noValidate
        >
          <Controller
            control={form.control}
            name="direction"
            render={renderDirection}
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
                render={renderDebtor}
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
                render={renderAmount}
              />
            </LoanField>

            <LoanField
              label="Issued at"
              icon={<CalendarIcon className="size-3.5" />}
            >
              <Controller
                control={form.control}
                name="issuedAt"
                render={renderIssuedAt}
              />
            </LoanField>

            <LoanField
              label="Due (optional)"
              icon={<CalendarIcon className="size-3.5" />}
            >
              <Controller
                control={form.control}
                name="dueAt"
                render={renderDueAt}
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
                  render={renderNotes}
                />
              </LoanField>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-4">
            <Button type="button" onClick={handleCancel} variant={"secondary"}>
              Cancel
            </Button>
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
