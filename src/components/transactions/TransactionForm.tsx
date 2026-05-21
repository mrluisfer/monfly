import { useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import {
  CalendarIcon,
  DollarSignIcon,
  FileTextIcon,
  HandCoinsIcon,
  PlusIcon,
  SparklesIcon,
  TagIcon,
  TrendingDownIcon,
  TrendingUpIcon,
  XIcon,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import {
  transactionFormNames,
  type LoanMode,
} from "~/constants/forms/transaction-form-names";
import {
  LOAN_DIRECTION_LABEL,
  type LoanDirection,
} from "~/constants/loan-status";
import { useGetCategoriesByEmail } from "~/hooks/categories/useGetCategoriesByEmail";
import { useAppHaptics } from "~/hooks/haptics/useAppHaptics";
import { useActiveLoans } from "~/hooks/loans/useActiveLoans";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { postCategoryByEmailServer } from "~/lib/api/category/post-category-by-email";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import { formatCurrency } from "~/utils/format-currency";
import { invalidateCategoryQueries } from "~/utils/query-invalidation";
import { validLimitNumber } from "~/utils/valid-limit-number";

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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

type TransactionFormProps<FormValues extends FieldValues> = {
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void;
  buttonText?: string;
  description?: string;
  showDateDescription?: boolean;
  isLoading?: boolean;
};

const sectionClassName =
  "rounded-2xl border border-border/60 bg-background/75 backdrop-blur-sm p-4 shadow-sm sm:p-5";
const inputClassName =
  "h-12 rounded-xl border-border/60 bg-input/40 text-base shadow-none transition-colors sm:text-base";

export function TransactionForm<FormValues extends FieldValues>({
  form,
  onSubmit,
  buttonText = "Save",
  description,
  showDateDescription = false,
  isLoading = false,
}: TransactionFormProps<FormValues>) {
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [keyboardInset, setKeyboardInset] = useState(0);
  const focusScrollTimeoutRef = useRef<number | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const typeLabelId = useId();
  const { data: categories } = useGetCategoriesByEmail();

  const categoryOptions = useMemo(
    () =>
      categories?.map((cat) => ({
        label: cat.name,
        value: cat.name,
      })) ?? [],
    [categories],
  );
  const userEmail = useRouteUser();

  const queryClient = useQueryClient();
  const { warning } = useAppHaptics();

  const postCategoryByEmail = useMutation({
    fn: postCategoryByEmailServer,
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
        title: "Category already created",
        description: "We ignored the repeated request to avoid duplicates.",
      },
    },
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const viewport = window.visualViewport;
    if (!viewport) {
      return;
    }

    const updateKeyboardInset = () => {
      const nextInset = Math.max(
        0,
        window.innerHeight - viewport.height - viewport.offsetTop,
      );

      setKeyboardInset((currentInset) =>
        Math.abs(currentInset - nextInset) > 1 ? nextInset : currentInset,
      );
    };

    updateKeyboardInset();

    viewport.addEventListener("resize", updateKeyboardInset);
    viewport.addEventListener("scroll", updateKeyboardInset);

    return () => {
      viewport.removeEventListener("resize", updateKeyboardInset);
      viewport.removeEventListener("scroll", updateKeyboardInset);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (focusScrollTimeoutRef.current) {
        window.clearTimeout(focusScrollTimeoutRef.current);
      }
    };
  }, []);

  const handleMobileInputFocus = (event: FocusEvent<HTMLFormElement>) => {
    if (typeof window === "undefined" || window.innerWidth >= 768) {
      return;
    }

    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }

    if (!target.matches("input, textarea, [role='combobox']")) {
      return;
    }

    // Skip scroll for elements inside portals (e.g. popover CommandInput)
    if (formRef.current && !formRef.current.contains(target)) {
      return;
    }

    if (focusScrollTimeoutRef.current) {
      window.clearTimeout(focusScrollTimeoutRef.current);
    }

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    focusScrollTimeoutRef.current = window.setTimeout(() => {
      target.scrollIntoView({
        behavior: prefersReducedMotion ? "auto" : "smooth",
        block: "center",
        inline: "nearest",
      });
    }, 140);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit, () => {
          void warning();
        })}
        ref={formRef}
        className="space-y-4 pb-[calc(env(safe-area-inset-bottom)+0.25rem)] sm:space-y-5 sm:pb-0"
        autoComplete="off"
        aria-busy={isLoading}
        onFocusCapture={handleMobileInputFocus}
        style={
          keyboardInset > 0
            ? {
                paddingBottom: `calc(${keyboardInset}px + env(safe-area-inset-bottom) + 1rem)`,
              }
            : undefined
        }
      >
        {/* Amount + Type row */}
        <motion.div
          className={cn(
            sectionClassName,
            "transition-colors duration-500",
            "border-border/60",
          )}
          layout
        >
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name={transactionFormNames.amount as Path<FormValues>}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="text-muted-foreground/70 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase">
                    <DollarSignIcon className="size-3 text-emerald-500" />
                    Amount
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <span className="text-muted-foreground/60 pointer-events-none absolute left-4 text-xl font-semibold select-none">
                        $
                      </span>
                      <Input
                        id={transactionFormNames.amount}
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        placeholder="0.00"
                        className={cn(
                          inputClassName,
                          "[appearance:textfield] pl-9 text-xl font-bold tracking-tight [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
                        )}
                        {...field}
                        onChange={(e) =>
                          field.onChange(validLimitNumber(e.target.value))
                        }
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={transactionFormNames.type as Path<FormValues>}
              render={({ field }) => {
                const currentType = (field.value as string) || "";
                return (
                  <FormItem className="space-y-2">
                    <FormLabel
                      id={typeLabelId}
                      className="text-muted-foreground/70 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase"
                    >
                      <SparklesIcon className="size-3 text-purple-500" />
                      Type
                    </FormLabel>
                    <FormControl>
                      <div
                        className="bg-muted/50 relative flex rounded-xl p-1"
                        role="radiogroup"
                        aria-labelledby={typeLabelId}
                      >
                        {/* Sliding indicator */}
                        {currentType && (
                          <motion.span
                            className="pointer-events-none absolute inset-y-1 rounded-lg border"
                            style={{ width: "calc(50% - 4px)" }}
                            animate={{
                              left:
                                currentType === "income"
                                  ? "4px"
                                  : "calc(50% + 0px)",
                              backgroundColor:
                                currentType === "income"
                                  ? "rgba(16,185,129,0.10)"
                                  : "rgba(239,68,68,0.10)",
                              borderColor:
                                currentType === "income"
                                  ? "rgba(16,185,129,0.30)"
                                  : "rgba(239,68,68,0.30)",
                            }}
                            initial={false}
                            transition={{
                              type: "spring",
                              bounce: 0.15,
                              duration: 0.4,
                            }}
                          />
                        )}
                        <button
                          type="button"
                          role="radio"
                          aria-checked={currentType === "income"}
                          onClick={() => field.onChange("income")}
                          className={cn(
                            "focus-visible:ring-ring/50 relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none",
                            currentType === "income"
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <TrendingUpIcon className="size-4 shrink-0" />
                          Income
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={currentType === "expense"}
                          onClick={() => field.onChange("expense")}
                          className={cn(
                            "focus-visible:ring-ring/50 relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none",
                            currentType === "expense"
                              ? "text-red-700 dark:text-red-300"
                              : "text-muted-foreground hover:text-foreground",
                          )}
                        >
                          <TrendingDownIcon className="size-4 shrink-0" />
                          Expense
                        </button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>
        </motion.div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <div className={sectionClassName}>
            <FormField
              control={form.control}
              name={transactionFormNames.category as Path<FormValues>}
              render={({ field }) => {
                const value = field.value as string | undefined;

                const showAddNew =
                  categoryInputValue.length > 1 &&
                  !categories?.some(
                    (cat) =>
                      cat.name.toLowerCase() ===
                      categoryInputValue.toLowerCase(),
                  );

                return (
                  <FormItem className="space-y-2">
                    <FormLabel
                      htmlFor={transactionFormNames.category}
                      className="text-muted-foreground/70 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase"
                    >
                      <TagIcon className="size-3 text-blue-500" />
                      Category
                    </FormLabel>
                    <FormControl>
                      <div className="w-full space-y-3">
                        {categoryOptions.length > 0 ? (
                          <Select
                            value={value ?? ""}
                            onValueChange={(val) => field.onChange(val)}
                          >
                            <SelectTrigger className="border-border/60 bg-input/40 h-12 w-full rounded-xl">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {categoryOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                    className={"capitalize"}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="text-muted-foreground py-3 text-center text-sm">
                            No categories yet
                          </p>
                        )}
                        <div className="flex items-center gap-2">
                          <Input
                            value={categoryInputValue}
                            onChange={(e) =>
                              setCategoryInputValue(e.target.value)
                            }
                            placeholder="New category name..."
                            className="border-border/60 bg-input/40 h-10 flex-1 rounded-xl text-sm shadow-none"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="default"
                            className="h-10 rounded-xl"
                            onClick={async () => {
                              const inputVal = categoryInputValue;
                              field.onChange(inputVal);
                              setCategoryInputValue("");
                              await postCategoryByEmail.mutate({
                                data: {
                                  email: userEmail,
                                  category: {
                                    name: inputVal,
                                    icon: "other",
                                  },
                                },
                              });
                            }}
                            disabled={
                              !showAddNew ||
                              postCategoryByEmail.status === "pending"
                            }
                          >
                            <PlusIcon size={14} />
                            Add
                          </Button>
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                );
              }}
            />
          </div>

          <div className={sectionClassName}>
            <FormField
              control={form.control}
              name={transactionFormNames.description as Path<FormValues>}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel
                    htmlFor={transactionFormNames.description}
                    className="text-muted-foreground/70 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase"
                  >
                    <FileTextIcon className="size-3 text-orange-500" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        placeholder="Add a description..."
                        id={transactionFormNames.description}
                        className={cn(inputClassName, "pl-10 text-sm")}
                        {...field}
                      />
                      <FileTextIcon className="text-muted-foreground/60 absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-4">
              <FormField
                control={form.control}
                name={transactionFormNames.date as Path<FormValues>}
                render={({ field }) => (
                  <FormItem className="flex flex-col space-y-2">
                    <FormLabel
                      htmlFor={transactionFormNames.date}
                      className="text-muted-foreground/70 flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase"
                    >
                      <CalendarIcon className="size-3 text-indigo-500" />
                      Date
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          id={transactionFormNames.date}
                          type="date"
                          className={cn(
                            inputClassName,
                            "w-full cursor-pointer pl-10 [color-scheme:light] dark:[color-scheme:dark]",
                          )}
                          value={
                            field.value
                              ? format(field.value as Date, "yyyy-MM-dd")
                              : ""
                          }
                          onChange={(e) => {
                            const date = e.target.value
                              ? new Date(e.target.value + "T00:00:00")
                              : undefined;
                            field.onChange(date);
                          }}
                        />
                        <CalendarIcon className="text-muted-foreground/60 pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2" />
                      </div>
                    </FormControl>
                    {showDateDescription && (
                      <FormDescription>
                        {description || "Pick a date"}
                      </FormDescription>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        <LoanSection form={form} />

        <div className="flex items-center justify-between pt-1 sm:pt-2">
          <DialogClose
            render={
              <Button type="button" variant={"outline"} size={"lg"}></Button>
            }
          >
            <XIcon />
            Cancel
          </DialogClose>
          <Button
            type="submit"
            className="font-medium hover:shadow-xl"
            disabled={isLoading}
            size={"lg"}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SparklesIcon className="size-4" />
                {buttonText}
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

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
  const includeLoanId = initialLoanId;

  // Only fetch the picker list when the user actually opens "apply" mode.
  // Avoids one wasted request per form mount in the common case.
  const enableQuery = mode === "apply";
  const { data: activeLoansResponse, isPending } = useActiveLoans({
    includeId: includeLoanId,
  });
  const activeLoans = useMemo(
    () => activeLoansResponse?.data ?? [],
    [activeLoansResponse?.data],
  );

  // Group loans by direction so the picker can render two clear sections:
  // "Owed to me" (income side) vs "I owe" (expense side).
  const grouped = useMemo(() => {
    const lent: typeof activeLoans = [];
    const borrowed: typeof activeLoans = [];
    for (const loan of activeLoans) {
      if (loan.direction === "borrowed") borrowed.push(loan);
      else lent.push(loan);
    }
    return { lent, borrowed };
  }, [activeLoans]);

  // When the user picks a loan, the transaction type is fully determined by
  // the loan's direction — flipping it here keeps server-side validation
  // happy and removes a manual coordination step.
  const handleLoanPick = (
    loanId: string,
    fieldOnChange: (val: string | null) => void,
  ) => {
    fieldOnChange(loanId === "" ? null : loanId);
    if (!loanId) return;
    const loan = activeLoans.find((l) => l.id === loanId);
    if (!loan) return;
    const nextType: "income" | "expense" =
      loan.direction === "lent" ? "income" : "expense";
    form.setValue(
      transactionFormNames.type as Path<FormValues>,
      nextType as never,
      { shouldDirty: true, shouldValidate: true },
    );
  };

  const setMode = (next: LoanMode) => {
    form.setValue(
      transactionFormNames.loanMode as Path<FormValues>,
      next as never,
      { shouldValidate: false, shouldDirty: true },
    );
    // Mirror to legacy boolean for any consumer still reading it.
    form.setValue(
      transactionFormNames.markAsLoan as Path<FormValues>,
      (next === "create") as never,
      { shouldDirty: true },
    );
    // Clear fields belonging to the *other* modes so we don't submit stale data.
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
  };

  return (
    <div className={sectionClassName}>
      <div className="flex items-center gap-3">
        <div className="bg-primary/10 flex size-9 shrink-0 items-center justify-center rounded-xl">
          <HandCoinsIcon className="text-primary size-4" />
        </div>
        <div>
          <FormLabel className="text-foreground text-sm font-medium">
            Loan linkage
          </FormLabel>
          <FormDescription className="text-muted-foreground text-xs">
            Optionally tie this transaction to a loan.
          </FormDescription>
        </div>
      </div>

      {/* Tri-state segmented control */}
      <div
        className="bg-muted/50 mt-4 grid grid-cols-3 gap-1 rounded-xl p-1"
        role="radiogroup"
        aria-label="Loan linkage mode"
      >
        <ModeButton
          active={mode === "none"}
          onClick={() => setMode("none")}
          label="None"
        />
        <ModeButton
          active={mode === "create"}
          onClick={() => setMode("create")}
          label="New loan"
        />
        <ModeButton
          active={mode === "apply"}
          onClick={() => setMode("apply")}
          label="Apply to loan"
        />
      </div>

      <AnimatePresence initial={false} mode="wait">
        {mode === "create" && (
          <motion.div
            key="loan-create"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name={transactionFormNames.loanDebtor as Path<FormValues>}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-muted-foreground/70 text-xs font-semibold tracking-wider uppercase">
                      Debtor
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        value={(field.value as string | undefined) ?? ""}
                        placeholder="e.g. Juan, SAT, Insurance Co."
                        autoComplete="off"
                        className={inputClassName}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={transactionFormNames.loanDueAt as Path<FormValues>}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-muted-foreground/70 text-xs font-semibold tracking-wider uppercase">
                      Due date{" "}
                      <span className="text-muted-foreground/50 font-normal tracking-normal normal-case">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className={cn(
                          inputClassName,
                          "cursor-pointer lg:w-full",
                        )}
                        value={
                          (field.value as unknown) instanceof Date
                            ? format(field.value as Date, "yyyy-MM-dd")
                            : ""
                        }
                        onChange={(e) => {
                          const date = e.target.value
                            ? new Date(e.target.value + "T00:00:00")
                            : null;
                          field.onChange(date);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>
        )}

        {mode === "apply" && (
          <motion.div
            key="loan-apply"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-4">
              <FormField
                control={form.control}
                name={transactionFormNames.appliedToLoanId as Path<FormValues>}
                render={({ field }) => (
                  <FormItem className="space-y-2">
                    <FormLabel className="text-muted-foreground/70 text-xs font-semibold tracking-wider uppercase">
                      Loan to pay
                    </FormLabel>
                    <FormControl>
                      <Select
                        value={(field.value as string | undefined) ?? ""}
                        onValueChange={(val) => {
                          if (val) handleLoanPick(val, field.onChange);
                        }}
                        disabled={!enableQuery || isPending}
                      >
                        <SelectTrigger
                          className={cn(
                            inputClassName,
                            "w-full justify-between",
                          )}
                        >
                          <SelectValue
                            placeholder={
                              isPending
                                ? "Loading…"
                                : activeLoans.length === 0
                                  ? "No active loans"
                                  : "Select a loan"
                            }
                          >
                            {(value: unknown) => {
                              const id = typeof value === "string" ? value : "";
                              const loan = id
                                ? activeLoans.find((l) => l.id === id)
                                : undefined;
                              if (!loan) {
                                return isPending
                                  ? "Loading…"
                                  : activeLoans.length === 0
                                    ? "No active loans"
                                    : "Select a loan";
                              }
                              // const remaining = loan.amount - loan.amountPaid;
                              return (
                                <span className="flex w-full items-center justify-between gap-3">
                                  <span className="truncate capitalize">
                                    {loan.debtor}
                                  </span>
                                  <span
                                    className={cn(
                                      "text-xs tabular-nums",
                                      loan.direction === "lent"
                                        ? "text-emerald-600 dark:text-emerald-400"
                                        : "text-red-600 dark:text-red-400",
                                    )}
                                  >
                                    {formatCurrency(loan.amount, "USD")} ·{" "}
                                    {
                                      LOAN_DIRECTION_LABEL[
                                        loan.direction as LoanDirection
                                      ]
                                    }
                                  </span>
                                </span>
                              );
                            }}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {grouped.lent.length > 0 && (
                            <SelectGroup>
                              <div className="text-muted-foreground px-2 pt-1.5 pb-1 text-[10px] font-semibold tracking-wider uppercase">
                                {LOAN_DIRECTION_LABEL.lent} · sets income
                              </div>
                              {grouped.lent.map((loan) => (
                                <LoanOption
                                  key={loan.id}
                                  loan={loan}
                                  direction="lent"
                                />
                              ))}
                            </SelectGroup>
                          )}
                          {grouped.borrowed.length > 0 && (
                            <SelectGroup>
                              <div className="text-muted-foreground px-2 pt-1.5 pb-1 text-[10px] font-semibold tracking-wider uppercase">
                                {LOAN_DIRECTION_LABEL.borrowed} · sets expense
                              </div>
                              {grouped.borrowed.map((loan) => (
                                <LoanOption
                                  key={loan.id}
                                  loan={loan}
                                  direction="borrowed"
                                />
                              ))}
                            </SelectGroup>
                          )}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription className="text-xs">
                      Pick any active loan. Income for &quot;Owed to me&quot;
                      (someone paid you); expense for &quot;I owe&quot; (you
                      paid someone). Transaction type is set automatically.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function LoanOption({
  loan,
  direction,
}: {
  loan: { id: string; debtor: string; amount: number; amountPaid: number };
  direction: LoanDirection;
}) {
  const remaining = loan.amount - loan.amountPaid;
  return (
    <SelectItem value={loan.id}>
      <span className="flex w-full items-center justify-between gap-3">
        <span className="truncate capitalize">{loan.debtor}</span>
        <span
          className={cn(
            "text-xs tabular-nums",
            direction === "lent"
              ? "text-emerald-600 dark:text-emerald-400"
              : "text-red-600 dark:text-red-400",
          )}
        >
          {formatCurrency(remaining, "USD")} left
        </span>
      </span>
    </SelectItem>
  );
}

function ModeButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={onClick}
      className={cn(
        "focus-visible:ring-ring/50 rounded-lg py-2 text-xs font-medium transition-colors duration-200 focus-visible:ring-2 focus-visible:outline-none",
        active
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {label}
    </button>
  );
}
