import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  PlusIcon,
  SaveIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  XIcon,
} from "lucide-react";
import {
  type ChangeEvent,
  type ComponentProps,
  type FocusEvent,
  type KeyboardEvent,
  type ReactNode,
  type RefObject,
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  type LoanMode,
  transactionFormNames,
} from "~/constants/forms/transaction-form-names";
import {
  LOAN_DIRECTION_LABEL,
  type LoanDirection,
} from "~/constants/loan-status";
import { useCards } from "~/hooks/cards";
import { useGetCategoriesByEmail } from "~/hooks/categories/useGetCategoriesByEmail";
import { useActiveLoans } from "~/hooks/loans/useActiveLoans";
import { useCurrency } from "~/hooks/useCurrency";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { postCategoryByEmailServer } from "~/lib/api/category/post-category-by-email";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import type { FieldRenderProps, RenderedField } from "~/types/form";
import { invalidateCategoryQueries } from "~/utils/query-invalidation";

import { AmountInput } from "../shared/AmountInput";
import { Button } from "../ui/button";
import { DialogClose } from "../ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { NativeSelect, NativeSelectOption } from "../ui/native-select";
// The loan picker keeps the rich Select: its options render amounts and colour
// per direction, which native <option> can't do.
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Spinner } from "../ui/spinner";

interface TransactionFormProps<FormValues extends FieldValues> {
  buttonText?: string;
  description?: string;
  form: UseFormReturn<FormValues>;
  isLoading?: boolean;
  onSubmit: (data: FormValues) => void;
  showDateDescription?: boolean;
}

/** Field labels: one weight, one size, no decorative icons. */
const labelClassName = "text-sm font-medium";
/** 44px controls — the minimum comfortable touch target on phones. */
const controlClassName = "h-11";
// `NativeSelect` styles its wrapper, so the control is reached through the child
// selector. `text-base` below md matches `Input` and stops iOS from zooming the
// viewport when the select gets focus.
const nativeSelectClassName =
  "w-full [&>select]:h-11 [&>select]:text-base md:[&>select]:text-sm";

const optionalHint = (
  <span className="font-normal text-muted-foreground">(optional)</span>
);

export function TransactionForm<FormValues extends FieldValues>({
  form,
  onSubmit,
  buttonText = "Save",
  description,
  showDateDescription = false,
  isLoading = false,
}: TransactionFormProps<FormValues>) {
  const uid = useId();
  const formRef = useRef<HTMLFormElement>(null);
  const [keyboardInset, setKeyboardInset] = useState(0);

  // Read once here instead of inside `CardField`, so the row below knows
  // whether it renders one column or two.
  const { data: cardsResponse, isPending: cardsPending } = useCards({
    status: "active",
  });
  const cards = useMemo(() => cardsResponse?.data ?? [], [cardsResponse?.data]);
  const showCardField = cardsPending || cards.length > 0;

  const errorCount = Object.keys(form.formState.errors).length;
  const showErrorSummary = form.formState.isSubmitted && errorCount > 0;

  useKeyboardInset(setKeyboardInset);
  const handleMobileInputFocus = useMobileFocusScroll(formRef);
  const handleSubmit = form.handleSubmit(onSubmit);

  return (
    <Form {...form}>
      <form
        ref={formRef}
        onSubmit={handleSubmit}
        className="flex flex-col"
        autoComplete="off"
        // Zod owns validation; the native bubbles would fight the inline
        // messages and are unreadable to screen readers.
        noValidate
        aria-busy={isLoading}
        onFocusCapture={handleMobileInputFocus}
      >
        <div className="space-y-6">
          {/* ── Amount + type ─────────────────────────────────────────────
            The only raised block in the form: it carries the two decisions
            everything else depends on. */}
          <div className="grid gap-5 rounded-3xl border border-border/60 p-4 sm:grid-cols-2 sm:items-start">
            <AmountField form={form} uid={uid} />
            <TypeField form={form} uid={uid} />
          </div>

          {/* ── Details ─────────────────────────────────────────────────── */}
          <div className="grid gap-5 lg:grid-cols-2 lg:items-start">
            {/* Loan linkage sits under Category so the column that used to
                end early carries it, and so DOM order still matches reading
                order at every breakpoint — no `order` tricks that would
                desync the tab sequence. */}
            <div className="grid gap-5">
              <CategoryField form={form} uid={uid} />
              <LoanSection form={form} />
            </div>

            <div className="grid gap-5">
              <DescriptionField form={form} />

              <div
                className={cn("grid gap-5", showCardField && "sm:grid-cols-2")}
              >
                <DateField
                  form={form}
                  description={description}
                  showDateDescription={showDateDescription}
                />
                {showCardField ? <CardField form={form} cards={cards} /> : null}
              </div>
            </div>
          </div>
        </div>

        {/* Keeps the field under the caret reachable above the on-screen
            keyboard; collapses to nothing when the keyboard is closed. */}
        <div aria-hidden="true" style={{ height: keyboardInset }} />

        {/* ── Actions ───────────────────────────────────────────────────
            Pinned to the bottom of the scroller: on a phone the save button
            is always one thumb away, never a scroll away. */}
        <div className="sticky bottom-0 z-10 -mx-4 mt-6 -mb-4 border-border/60 border-t bg-popover/95 px-4 pt-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))] backdrop-blur-sm sm:-mx-6 sm:px-6">
          {showErrorSummary ? (
            <p className="mb-3 text-destructive text-sm">
              {errorCount === 1
                ? "One field still needs your attention."
                : `${errorCount} fields still need your attention.`}
            </p>
          ) : null}
          <div className="flex items-center gap-3">
            <DialogClose
              render={
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  className="flex-1 sm:flex-none"
                />
              }
            >
              <XIcon aria-hidden="true" />
              Cancel
            </DialogClose>
            <Button
              type="submit"
              size="lg"
              disabled={isLoading}
              className="flex-1 sm:ml-auto sm:flex-none"
            >
              {isLoading ? (
                <Spinner />
              ) : (
                <SaveIcon className="size-4" aria-hidden="true" />
              )}
              {isLoading ? "Saving…" : (buttonText ?? "Save")}
            </Button>
          </div>
          {/* Announced once per submit; the focused field reads its own error. */}
          <span aria-live="polite" className="sr-only">
            {showErrorSummary
              ? `Form not submitted. ${errorCount} field${errorCount === 1 ? "" : "s"} need attention.`
              : ""}
          </span>
        </div>
      </form>
    </Form>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Amount
   ──────────────────────────────────────────────────────────────────────── */

function AmountField<FormValues extends FieldValues>({
  form,
  uid,
}: {
  form: UseFormReturn<FormValues>;
  uid: string;
}) {
  const { currency, formatPlain } = useCurrency();
  const currentType = form.watch(transactionFormNames.type as Path<FormValues>);
  const isExpense = currentType !== "income";
  const amountId = `${uid}-amount`;
  const errorId = `${amountId}-error`;

  const render = useCallback(
    ({ field, fieldState }: FieldRenderProps<FormValues>) => {
      const parsed = Number(field.value);
      const hasAmount = Number.isFinite(parsed) && parsed > 0;

      // Both are pulled out of the JSX: a bare `a ? b : c` between two strings
      // reads as a leaked render, and the tone was a nested ternary.
      const echo = hasAmount
        ? `${isExpense ? "−" : "+"}${formatPlain(parsed)}`
        : currency;
      let echoTone = "text-muted-foreground";
      if (hasAmount) {
        echoTone = isExpense ? "text-destructive" : "text-success";
      }

      return (
        // Not a `FormItem`: `AmountInput` renders a fragment, which
        // `FormControl`'s Slot cannot forward props to.
        <div className="grid gap-2">
          <div className="flex items-baseline justify-between gap-2">
            <label htmlFor={amountId} className={labelClassName}>
              Amount
            </label>
            {/* Echoes the typed figure back in the user's currency — catches
                a stray zero before it reaches the ledger. */}
            <span
              aria-hidden="true"
              className={cn("text-xs tabular-nums", echoTone)}
            >
              {echo}
            </span>
          </div>
          <AmountInput
            id={amountId}
            name={field.name}
            value={(field.value as string | undefined) ?? ""}
            onChange={field.onChange}
            placeholder="0.00"
            autoComplete="off"
            aria-invalid={Boolean(fieldState.error)}
            aria-describedby={fieldState.error ? errorId : undefined}
            // `md:text-2xl` too: `Input`'s own `md:text-sm` is a different
            // variant, so it would win from md up.
            className="h-14 font-semibold text-2xl tabular-nums md:text-2xl"
          />
          {fieldState.error ? (
            <p id={errorId} className="text-destructive text-sm">
              {fieldState.error.message}
            </p>
          ) : null}
        </div>
      );
    },
    [amountId, currency, errorId, formatPlain, isExpense],
  );

  return (
    <FormField
      control={form.control}
      name={transactionFormNames.amount as Path<FormValues>}
      render={render}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Type
   ──────────────────────────────────────────────────────────────────────── */

function TypeField<FormValues extends FieldValues>({
  form,
  uid,
}: {
  form: UseFormReturn<FormValues>;
  uid: string;
}) {
  const groupName = `${uid}-type`;

  const render = useCallback(
    ({ field, fieldState }: FieldRenderProps<FormValues>) => {
      const value = (field.value as string | undefined) ?? "";

      return (
        <fieldset className="min-w-0">
          {/* A visible <legend> renders outside the fieldset's layout box, so
              the grid lives on an inner wrapper. */}
          <legend className={cn(labelClassName, "mb-2 p-0")}>Type</legend>
          <SegmentedGroup className="grid-cols-2">
            <SegmentedOption
              name={groupName}
              value="income"
              checked={value === "income"}
              onSelect={field.onChange}
              checkedClassName="peer-checked:bg-success/10 peer-checked:text-success peer-checked:ring-success/25"
            >
              <TrendingUpIcon className="size-4" aria-hidden="true" />
              Income
            </SegmentedOption>
            <SegmentedOption
              name={groupName}
              value="expense"
              checked={value === "expense"}
              onSelect={field.onChange}
              checkedClassName="peer-checked:bg-destructive/10 peer-checked:text-destructive peer-checked:ring-destructive/25"
            >
              <TrendingDownIcon className="size-4" aria-hidden="true" />
              Expense
            </SegmentedOption>
          </SegmentedGroup>
          {fieldState.error ? (
            <p className="mt-2 text-destructive text-sm">
              {fieldState.error.message}
            </p>
          ) : null}
        </fieldset>
      );
    },
    [groupName],
  );

  return (
    <FormField
      control={form.control}
      name={transactionFormNames.type as Path<FormValues>}
      render={render}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Segmented controls
   A real <input type="radio"> group gives arrow-key navigation, roving focus
   and "radio button, 2 of 2" announcements for free. The visible chip is a
   sibling <span> styled off `peer-checked`, so there is no JS behind it.
   ──────────────────────────────────────────────────────────────────────── */

function SegmentedGroup({
  className,
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return (
    <div className={cn("grid gap-1 rounded-full bg-muted p-1", className)}>
      {children}
    </div>
  );
}

function SegmentedOption({
  name,
  value,
  checked,
  onSelect,
  checkedClassName,
  children,
}: {
  name: string;
  value: string;
  checked: boolean;
  onSelect: (value: string) => void;
  /** `peer-checked:` utilities that colour the selected chip. */
  checkedClassName?: string;
  children: ReactNode;
}) {
  const handleChange = useCallback(() => onSelect(value), [onSelect, value]);

  return (
    <label className="group relative flex min-w-0 cursor-pointer">
      <input
        type="radio"
        name={name}
        value={value}
        checked={checked}
        onChange={handleChange}
        className="peer sr-only"
      />
      <span
        className={cn(
          "flex min-h-11 w-full min-w-0 items-center justify-center gap-1.5 rounded-full px-2 font-medium text-muted-foreground text-sm ring-1 ring-transparent transition-colors",
          "group-hover:text-foreground",
          "peer-focus-visible:outline-1 peer-focus-visible:outline-ring peer-focus-visible:ring-3 peer-focus-visible:ring-ring/40",
          checkedClassName ??
            "peer-checked:bg-background peer-checked:text-foreground peer-checked:shadow-sm",
        )}
      >
        {children}
      </span>
    </label>
  );
}

/**
 * A chip in a group where *nothing* selected is a valid state — so these are
 * toggle buttons (`aria-pressed`), not radios: Space releases the pressed one,
 * which a radio group can never do.
 */
function SegmentedToggle({
  pressed,
  onToggle,
  children,
}: {
  pressed: boolean;
  onToggle: () => void;
  children: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onToggle}
      className={cn(
        "flex min-h-11 w-full min-w-0 items-center justify-center gap-1.5 rounded-full px-2 font-medium text-sm transition-colors",
        "focus-visible:outline-1 focus-visible:outline-ring focus-visible:ring-3 focus-visible:ring-ring/40",
        pressed
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Description
   ──────────────────────────────────────────────────────────────────────── */

function DescriptionField<FormValues extends FieldValues>({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) {
  const render = useCallback(
    ({ field }: FieldRenderProps<FormValues>) => (
      <FormItem>
        <FormLabel className={labelClassName}>
          Description {optionalHint}
        </FormLabel>
        <FormControl>
          <Input
            placeholder="e.g. Weekly groceries"
            autoCapitalize="sentences"
            enterKeyHint="next"
            className={controlClassName}
            {...field}
            value={(field.value as string | undefined) ?? ""}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
    [],
  );

  return (
    <FormField
      control={form.control}
      name={transactionFormNames.description as Path<FormValues>}
      render={render}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Dates
   ──────────────────────────────────────────────────────────────────────── */

type DateInputProps = Omit<
  ComponentProps<typeof Input>,
  "onChange" | "type" | "value"
> & {
  value: unknown;
  onValueChange: (value: Date | null | undefined) => void;
  /**
   * What an emptied field emits. The transaction date is optional
   * (`undefined`); the loan due date is nullable (`null`), and its Zod schema
   * rejects the other one — so the caller says which.
   */
  clearedValue?: null;
};

/**
 * Native `<input type="date">`: a free calendar, locale-aware display and
 * keyboard entry on every platform, wrapped so the form only ever sees Dates.
 */
function DateInput({
  value,
  onValueChange,
  clearedValue,
  className,
  ...props
}: DateInputProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onValueChange(
        event.target.value
          ? new Date(`${event.target.value}T00:00:00`)
          : clearedValue,
      );
    },
    [clearedValue, onValueChange],
  );

  return (
    <Input
      type="date"
      className={cn(
        controlClassName,
        // Safari gives date inputs an intrinsic width that ignores the grid
        // cell, so pin it explicitly.
        "block w-full min-w-0 cursor-pointer [color-scheme:light] dark:[color-scheme:dark]",
        className,
      )}
      value={value instanceof Date ? format(value, "yyyy-MM-dd") : ""}
      onChange={handleChange}
      {...props}
    />
  );
}

function DateField<FormValues extends FieldValues>({
  form,
  description,
  showDateDescription,
}: {
  form: UseFormReturn<FormValues>;
  description?: string;
  showDateDescription: boolean;
}) {
  const render = useCallback(
    ({ field }: FieldRenderProps<FormValues>) => (
      <FormItem>
        <FormLabel className={labelClassName}>Date</FormLabel>
        <FormControl>
          <DateInput value={field.value} onValueChange={field.onChange} />
        </FormControl>
        {showDateDescription ? (
          <FormDescription>{description || "Pick a date"}</FormDescription>
        ) : null}
        <FormMessage />
      </FormItem>
    ),
    [description, showDateDescription],
  );

  return (
    <FormField
      control={form.control}
      name={transactionFormNames.date as Path<FormValues>}
      render={render}
    />
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Category
   ──────────────────────────────────────────────────────────────────────── */

function CategoryField<FormValues extends FieldValues>({
  form,
  uid,
}: {
  form: UseFormReturn<FormValues>;
  uid: string;
}) {
  const render = useCallback(
    ({ field }: FieldRenderProps<FormValues>) => (
      <CategoryControl field={field} uid={uid} />
    ),
    [uid],
  );

  return (
    <FormField
      control={form.control}
      name={transactionFormNames.category as Path<FormValues>}
      render={render}
    />
  );
}

function CategoryControl<FormValues extends FieldValues>({
  field,
  uid,
}: {
  field: RenderedField<FormValues>;
  uid: string;
}) {
  const userEmail = useRouteUser();
  const queryClient = useQueryClient();
  const { data: categories, isPending } = useGetCategoriesByEmail();

  const [draft, setDraft] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const draftRef = useRef<HTMLInputElement>(null);

  const panelId = `${uid}-new-category`;
  const hintId = `${uid}-new-category-hint`;

  const hasCategories = categories.length > 0;
  // With an empty list there is nothing to pick, so the creator is the field.
  const creatorOpen = isCreating || !(isPending || hasCategories);

  const trimmed = draft.trim();
  const isDuplicate = categories.some(
    (cat) => cat.name.toLowerCase() === trimmed.toLowerCase(),
  );

  const postCategoryByEmail = useMutation({
    fn: postCategoryByEmailServer,
    idempotency: {
      getKey: (variables) =>
        JSON.stringify({
          email: variables.data.email,
          icon: variables.data.category.icon,
          name: variables.data.category.name.trim().toLowerCase(),
        }),
      onDuplicatePending: {
        title: "Category is already being created",
      },
      onDuplicateRecentSuccess: {
        description: "We ignored the repeated request to avoid duplicates.",
        title: "Category already created",
      },
    },
    onSuccess: async ({ data }) => {
      if (isErrorPayload(data)) {
        const response = data as { message?: string };
        sileo.error({ title: response.message ?? "Failed to create category" });
        return;
      }

      sileo.success({ title: "Category created successfully" });
      // Invalidate all queries that depend on category data
      await invalidateCategoryQueries(queryClient, userEmail);
    },
  });

  const isSaving = postCategoryByEmail.status === "pending";
  const canCreate = trimmed.length > 1 && !isDuplicate && !isSaving;

  useEffect(() => {
    if (isCreating) {
      draftRef.current?.focus();
    }
  }, [isCreating]);

  const fieldOnChange = field.onChange;
  const mutateCategory = postCategoryByEmail.mutate;

  const create = useCallback(async () => {
    if (!canCreate) {
      return;
    }
    const name = trimmed;
    // Select it right away so the form is valid before the round-trip.
    fieldOnChange(name);
    setDraft("");
    setIsCreating(false);
    await mutateCategory({
      data: { category: { icon: "other", name }, email: userEmail },
    });
  }, [canCreate, fieldOnChange, mutateCategory, trimmed, userEmail]);

  const handleDraftKeyDown = useCallback(
    async (event: KeyboardEvent<HTMLInputElement>) => {
      // Enter here means "create this category", never "submit the
      // transaction" — the outer form would otherwise steal it.
      if (event.key === "Enter") {
        event.preventDefault();
        await create();
      }
    },
    [create],
  );

  const handleDraftChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => setDraft(event.target.value),
    [],
  );

  const toggleCreating = useCallback(() => setIsCreating((open) => !open), []);

  let placeholder = "No categories yet";
  if (hasCategories) {
    placeholder = "Select a category";
  } else if (isPending) {
    placeholder = "Loading categories…";
  }

  let hint: string | null = null;
  if (trimmed.length === 1) {
    hint = "Use at least two characters.";
  } else if (isDuplicate) {
    hint = `“${trimmed}” already exists — pick it above.`;
  }

  return (
    <FormItem>
      <div className="flex items-center justify-between gap-2">
        <FormLabel className={labelClassName}>Category</FormLabel>
        {hasCategories ? (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            aria-expanded={isCreating}
            aria-controls={panelId}
            onClick={toggleCreating}
          >
            <PlusIcon aria-hidden="true" />
            New category
          </Button>
        ) : null}
      </div>

      <FormControl>
        {/* Native select: the platform picker beats any custom listbox on a
            phone, and it is keyboard- and screen-reader-complete. */}
        <NativeSelect
          className={nativeSelectClassName}
          disabled={!hasCategories}
          value={(field.value as string | undefined) ?? ""}
          onChange={fieldOnChange}
        >
          <NativeSelectOption value="" disabled>
            {placeholder}
          </NativeSelectOption>
          {categories.map((category) => (
            <NativeSelectOption
              key={category.id}
              value={category.name}
              className="capitalize"
            >
              {category.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </FormControl>

      {creatorOpen ? (
        <div
          id={panelId}
          className="fade-in-0 slide-in-from-top-1 grid animate-in gap-1.5 duration-200"
        >
          <div className="flex items-center gap-2">
            <Input
              ref={draftRef}
              value={draft}
              onChange={handleDraftChange}
              onKeyDown={handleDraftKeyDown}
              placeholder="New category name"
              aria-label="New category name"
              aria-describedby={hint ? hintId : undefined}
              autoCapitalize="words"
              enterKeyHint="done"
              className={cn(controlClassName, "flex-1")}
            />
            <Button
              type="button"
              size="lg"
              onClick={create}
              disabled={!canCreate}
            >
              {isSaving ? <Spinner /> : <PlusIcon aria-hidden="true" />}
              Add
            </Button>
          </div>
          {hint ? (
            <p id={hintId} className="text-muted-foreground text-xs">
              {hint}
            </p>
          ) : null}
        </div>
      ) : null}

      <FormMessage />
    </FormItem>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Card
   ──────────────────────────────────────────────────────────────────────── */

const NO_CARD = "none";

interface ActiveCard {
  id: string;
  last4?: string | null;
  name: string;
}

function CardField<FormValues extends FieldValues>({
  form,
  cards,
}: {
  form: UseFormReturn<FormValues>;
  cards: ActiveCard[];
}) {
  const render = useCallback(
    ({ field }: FieldRenderProps<FormValues>) => (
      <CardControl field={field} cards={cards} />
    ),
    [cards],
  );

  return (
    <FormField
      control={form.control}
      name={transactionFormNames.cardId as Path<FormValues>}
      render={render}
    />
  );
}

function CardControl<FormValues extends FieldValues>({
  field,
  cards,
}: {
  field: RenderedField<FormValues>;
  cards: ActiveCard[];
}) {
  const fieldOnChange = field.onChange;
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLSelectElement>) => {
      fieldOnChange(event.target.value === NO_CARD ? null : event.target.value);
    },
    [fieldOnChange],
  );

  const value = (field.value as string | null | undefined) ?? null;
  // A transaction can still point at a card that dropped out of the active
  // list (archived, for instance). Keep an option for it so the select shows
  // the real value instead of silently rendering the first entry while the
  // form holds something else.
  const isUnlisted = value !== null && !cards.some((card) => card.id === value);

  return (
    <FormItem>
      <FormLabel className={labelClassName}>Card {optionalHint}</FormLabel>
      <FormControl>
        <NativeSelect
          className={nativeSelectClassName}
          value={value ?? NO_CARD}
          onChange={handleChange}
        >
          <NativeSelectOption value={NO_CARD}>No card</NativeSelectOption>
          {isUnlisted ? (
            <NativeSelectOption value={value}>
              Assigned card (inactive)
            </NativeSelectOption>
          ) : null}
          {cards.map((card) => (
            <NativeSelectOption
              key={card.id}
              value={card.id}
              className="capitalize"
            >
              {card.last4 ? `${card.name} ···· ${card.last4}` : card.name}
            </NativeSelectOption>
          ))}
        </NativeSelect>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Loan linkage
   ──────────────────────────────────────────────────────────────────────── */

function LoanSection<FormValues extends FieldValues>({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) {
  const mode = (form.watch(transactionFormNames.loanMode as Path<FormValues>) ??
    "none") as LoanMode;

  // Capture the initially linked loan id at first render so that — even if
  // it's now fully paid — it stays visible in the picker while the user
  // edits the transaction. Captured once via useState lazy initializer so
  // changing selection mid-edit doesn't refetch.
  const [initialLoanId] = useState<string | null>(() => {
    const v = form.getValues(
      transactionFormNames.appliedToLoanId as Path<FormValues>,
    );
    return typeof v === "string" && v.length > 0 ? v : null;
  });

  const setMode = useCallback(
    (next: LoanMode) => {
      form.setValue(
        transactionFormNames.loanMode as Path<FormValues>,
        next as never,
        { shouldDirty: true, shouldValidate: false },
      );
      // Mirror to legacy boolean for any consumer still reading it.
      form.setValue(
        transactionFormNames.markAsLoan as Path<FormValues>,
        (next === "create") as never,
        { shouldDirty: true },
      );
      // Clear fields belonging to the *other* modes so we don't submit stale
      // data.
      if (next !== "create") {
        form.setValue(
          transactionFormNames.loanDebtor as Path<FormValues>,
          "" as never,
        );
        form.setValue(
          transactionFormNames.loanDueAt as Path<FormValues>,
          null as never,
        );
      }
      if (next !== "apply") {
        form.setValue(
          transactionFormNames.appliedToLoanId as Path<FormValues>,
          null as never,
        );
      }
    },
    [form],
  );

  const clearMode = useCallback(() => setMode("none"), [setMode]);
  const toggleCreate = useCallback(
    () => setMode(mode === "create" ? "none" : "create"),
    [mode, setMode],
  );
  const toggleApply = useCallback(
    () => setMode(mode === "apply" ? "none" : "apply"),
    [mode, setMode],
  );

  return (
    <fieldset className="min-w-0 border-border/60 border-t pt-5">
      <legend className="sr-only">Loan linkage (optional)</legend>
      <div className="grid gap-3">
        {/* "None" needs no button of its own: a pressed toggle releases on a
            second press, and the explicit Remove keeps that discoverable. */}
        <div className="flex min-h-8 items-center justify-between gap-2">
          <p className={labelClassName} aria-hidden="true">
            Loan linkage {optionalHint}
          </p>
          {mode === "none" ? null : (
            <Button type="button" variant="ghost" size="sm" onClick={clearMode}>
              <XIcon aria-hidden="true" />
              Remove
            </Button>
          )}
        </div>

        <div
          role="group"
          aria-label="Loan linkage"
          className="grid grid-cols-2 gap-1 rounded-full bg-muted p-1"
        >
          <SegmentedToggle pressed={mode === "create"} onToggle={toggleCreate}>
            New loan
          </SegmentedToggle>
          <SegmentedToggle pressed={mode === "apply"} onToggle={toggleApply}>
            Pay a loan
          </SegmentedToggle>
        </div>

        {mode === "create" && <LoanCreateFields form={form} />}

        {/* Mounted only in "apply" mode, so the loans request is never made for
          the ordinary transaction the user is almost always recording. */}
        {mode === "apply" && (
          <LoanPicker form={form} initialLoanId={initialLoanId} />
        )}
      </div>
    </fieldset>
  );
}

function LoanCreateFields<FormValues extends FieldValues>({
  form,
}: {
  form: UseFormReturn<FormValues>;
}) {
  const renderDebtor = useCallback(
    ({ field }: FieldRenderProps<FormValues>) => (
      <FormItem>
        <FormLabel className={labelClassName}>Debtor</FormLabel>
        <FormControl>
          <Input
            placeholder="e.g. Juan, SAT, Insurance Co."
            autoComplete="off"
            autoCapitalize="words"
            enterKeyHint="next"
            className={controlClassName}
            {...field}
            value={(field.value as string | undefined) ?? ""}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
    [],
  );

  const renderDueAt = useCallback(
    ({ field }: FieldRenderProps<FormValues>) => (
      <FormItem>
        <FormLabel className={labelClassName}>
          Due date {optionalHint}
        </FormLabel>
        <FormControl>
          <DateInput
            value={field.value}
            onValueChange={field.onChange}
            clearedValue={null}
          />
        </FormControl>
        <FormMessage />
      </FormItem>
    ),
    [],
  );

  return (
    <div className="fade-in-0 slide-in-from-top-1 grid animate-in gap-5 duration-200 sm:grid-cols-2 lg:grid-cols-1">
      <FormField
        control={form.control}
        name={transactionFormNames.loanDebtor as Path<FormValues>}
        render={renderDebtor}
      />
      <FormField
        control={form.control}
        name={transactionFormNames.loanDueAt as Path<FormValues>}
        render={renderDueAt}
      />
    </div>
  );
}

interface ActiveLoan {
  amount: number;
  amountPaid: number;
  debtor: string;
  direction: string;
  id: string;
}

function LoanPicker<FormValues extends FieldValues>({
  form,
  initialLoanId,
}: {
  form: UseFormReturn<FormValues>;
  initialLoanId: string | null;
}) {
  const { data: activeLoansResponse, isPending } = useActiveLoans({
    includeId: initialLoanId,
  });
  const activeLoans = useMemo(
    () => (activeLoansResponse?.data ?? []) as ActiveLoan[],
    [activeLoansResponse?.data],
  );

  const setType = form.setValue;

  // When the user picks a loan, the transaction type is fully determined by
  // the loan's direction — flipping it here keeps server-side validation
  // happy and removes a manual coordination step.
  const applyLoanDirection = useCallback(
    (loanId: string) => {
      const loan = activeLoans.find((l) => l.id === loanId);
      if (!loan) {
        return;
      }
      const nextType: "income" | "expense" =
        loan.direction === "lent" ? "income" : "expense";
      setType(
        transactionFormNames.type as Path<FormValues>,
        nextType as never,
        {
          shouldDirty: true,
          shouldValidate: true,
        },
      );
    },
    [activeLoans, setType],
  );

  const render = useCallback(
    ({ field }: FieldRenderProps<FormValues>) => (
      <LoanPickerControl
        field={field}
        loans={activeLoans}
        isPending={isPending}
        onPick={applyLoanDirection}
      />
    ),
    [activeLoans, applyLoanDirection, isPending],
  );

  return (
    <div className="fade-in-0 slide-in-from-top-1 animate-in duration-200">
      <FormField
        control={form.control}
        name={transactionFormNames.appliedToLoanId as Path<FormValues>}
        render={render}
      />
    </div>
  );
}

function LoanPickerControl<FormValues extends FieldValues>({
  field,
  loans,
  isPending,
  onPick,
}: {
  field: RenderedField<FormValues>;
  loans: ActiveLoan[];
  isPending: boolean;
  onPick: (loanId: string) => void;
}) {
  const fieldOnChange = field.onChange;

  const handleValueChange = useCallback(
    (value: string | null) => {
      if (!value) {
        return;
      }
      fieldOnChange(value);
      onPick(value);
    },
    [fieldOnChange, onPick],
  );

  // Group loans by direction so the picker can render two clear sections:
  // "Owed to me" (income side) vs "I owe" (expense side).
  const grouped = useMemo(() => {
    const lent: ActiveLoan[] = [];
    const borrowed: ActiveLoan[] = [];
    for (const loan of loans) {
      if (loan.direction === "borrowed") {
        borrowed.push(loan);
      } else {
        lent.push(loan);
      }
    }
    return { borrowed, lent };
  }, [loans]);

  let placeholder = "Select a loan";
  if (isPending) {
    placeholder = "Loading…";
  } else if (loans.length === 0) {
    placeholder = "No active loans";
  }

  const renderValue = useCallback(
    (value: unknown) => {
      const loan =
        typeof value === "string"
          ? loans.find((l) => l.id === value)
          : undefined;
      return loan ? <LoanOptionRow loan={loan} /> : placeholder;
    },
    [loans, placeholder],
  );

  const selected = loans.find((l) => l.id === field.value);
  const selectedType = selected?.direction === "lent" ? "income" : "expense";

  return (
    <FormItem>
      <FormLabel className={labelClassName}>Loan to pay</FormLabel>
      <FormControl>
        <Select
          value={(field.value as string | undefined) ?? ""}
          onValueChange={handleValueChange}
          disabled={isPending || loans.length === 0}
        >
          <SelectTrigger
            className={cn(controlClassName, "w-full justify-between")}
          >
            <SelectValue placeholder={placeholder}>{renderValue}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            {grouped.lent.length > 0 && (
              <SelectGroup>
                <div className="px-2 pt-1.5 pb-1 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                  {LOAN_DIRECTION_LABEL.lent} · sets income
                </div>
                {grouped.lent.map((loan) => (
                  <SelectItem key={loan.id} value={loan.id}>
                    <LoanOptionRow loan={loan} />
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
            {grouped.borrowed.length > 0 && (
              <SelectGroup>
                <div className="px-2 pt-1.5 pb-1 font-semibold text-[10px] text-muted-foreground uppercase tracking-wider">
                  {LOAN_DIRECTION_LABEL.borrowed} · sets expense
                </div>
                {grouped.borrowed.map((loan) => (
                  <SelectItem key={loan.id} value={loan.id}>
                    <LoanOptionRow loan={loan} />
                  </SelectItem>
                ))}
              </SelectGroup>
            )}
          </SelectContent>
        </Select>
      </FormControl>
      <FormDescription>
        Picking a loan sets the transaction type for you: income for “
        {LOAN_DIRECTION_LABEL.lent}”, expense for “
        {LOAN_DIRECTION_LABEL.borrowed}”.
      </FormDescription>
      {/* The type toggle above flips on its own here — say so out loud for
          anyone who can't see it happen. */}
      <p role="status" className="sr-only">
        {selected ? `Transaction type set to ${selectedType}.` : ""}
      </p>
      <FormMessage />
    </FormItem>
  );
}

/** Debtor on the left, what is still owed on the right. */
function LoanOptionRow({ loan }: { loan: ActiveLoan }) {
  const { formatPlain } = useCurrency();
  const remaining = loan.amount - loan.amountPaid;

  return (
    <span className="flex w-full items-center justify-between gap-3">
      <span className="truncate capitalize">{loan.debtor}</span>
      <span
        className={cn(
          "text-xs tabular-nums",
          (loan.direction as LoanDirection) === "lent"
            ? "text-success"
            : "text-destructive",
        )}
      >
        {formatPlain(remaining)} left
      </span>
    </span>
  );
}

/* ────────────────────────────────────────────────────────────────────────
   Mobile keyboard helpers
   ──────────────────────────────────────────────────────────────────────── */

/** Tracks how much of the viewport the on-screen keyboard covers. */
function useKeyboardInset(
  setInset: (updater: (prev: number) => number) => void,
) {
  useEffect(() => {
    const viewport =
      typeof window === "undefined" ? undefined : window.visualViewport;
    if (!viewport) {
      return;
    }

    const update = () => {
      const next = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );
      setInset((current) => (Math.abs(current - next) > 1 ? next : current));
    };

    update();
    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, [setInset]);
}

/** Centres the focused control on phones so the keyboard never hides it. */
function useMobileFocusScroll(formRef: RefObject<HTMLFormElement | null>) {
  // 0 is never a live timeout id, and `clearTimeout` ignores an unknown one,
  // so the ref needs no null check on either path.
  const timeoutRef = useRef(0);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return useCallback(
    (event: FocusEvent<HTMLFormElement>) => {
      if (typeof window === "undefined" || window.innerWidth >= 768) {
        return;
      }

      const { target } = event;
      if (!(target instanceof HTMLElement)) {
        return;
      }
      if (!target.matches("input, textarea, select, [role='combobox']")) {
        return;
      }
      // Skip elements inside portals (e.g. the loan picker's popup).
      if (formRef.current && !formRef.current.contains(target)) {
        return;
      }

      window.clearTimeout(timeoutRef.current);

      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)",
      ).matches;

      timeoutRef.current = window.setTimeout(() => {
        target.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "center",
          inline: "nearest",
        });
      }, 140);
    },
    [formRef],
  );
}
