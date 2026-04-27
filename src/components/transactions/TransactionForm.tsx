import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type FocusEvent,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { transactionFormNames } from "~/constants/forms/transaction-form-names";
import { useGetCategoriesByEmail } from "~/hooks/categories/useGetCategoriesByEmail";
import { useAppHaptics } from "~/hooks/haptics/useAppHaptics";
import { isErrorPayload, useMutation } from "~/hooks/useMutation";
import { useRouteUser } from "~/hooks/useRouteUser";
import { postCategoryByEmailServer } from "~/lib/api/category/post-category-by-email";
import { sileo } from "~/lib/toaster";
import { cn } from "~/lib/utils";
import { invalidateCategoryQueries } from "~/utils/query-invalidation";
import { validLimitNumber } from "~/utils/valid-limit-number";
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
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { Button } from "../ui/button";
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
import { Switch } from "../ui/switch";

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
    [categories]
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
        window.innerHeight - viewport.height - viewport.offsetTop
      );

      setKeyboardInset((currentInset) =>
        Math.abs(currentInset - nextInset) > 1 ? nextInset : currentInset
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
      "(prefers-reduced-motion: reduce)"
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
            "border-border/60"
          )}
          layout
        >
          <div className="flex flex-col gap-5">
            <FormField
              control={form.control}
              name={transactionFormNames.amount as Path<FormValues>}
              render={({ field }) => (
                <FormItem className="space-y-2">
                  <FormLabel className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                    <DollarSignIcon className="size-3 text-emerald-500" />
                    Amount
                  </FormLabel>
                  <FormControl>
                    <div className="relative flex items-center">
                      <span className="pointer-events-none absolute left-4 text-xl font-semibold text-muted-foreground/60 select-none">
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
                          "pl-9 text-xl font-bold tracking-tight [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
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
                      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70"
                    >
                      <SparklesIcon className="size-3 text-purple-500" />
                      Type
                    </FormLabel>
                    <FormControl>
                      <div
                        className="relative flex p-1 rounded-xl bg-muted/50"
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
                            "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                            currentType === "income"
                              ? "text-emerald-700 dark:text-emerald-300"
                              : "text-muted-foreground hover:text-foreground"
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
                            "relative z-10 flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                            currentType === "expense"
                              ? "text-red-700 dark:text-red-300"
                              : "text-muted-foreground hover:text-foreground"
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
                      categoryInputValue.toLowerCase()
                  );

                return (
                  <FormItem className="space-y-2">
                    <FormLabel
                      htmlFor={transactionFormNames.category}
                      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70"
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
                            <SelectTrigger className="w-full rounded-xl border-border/60 bg-input/40 h-12">
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectGroup>
                                {categoryOptions.map((option) => (
                                  <SelectItem
                                    key={option.value}
                                    value={option.value}
                                  >
                                    {option.label}
                                  </SelectItem>
                                ))}
                              </SelectGroup>
                            </SelectContent>
                          </Select>
                        ) : (
                          <p className="py-3 text-center text-sm text-muted-foreground">
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
                            className="h-10 flex-1 rounded-xl border-border/60 bg-input/40 text-sm shadow-none"
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
                    className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70"
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
                      <FileTextIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60" />
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
                      className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground/70"
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
                            "w-full cursor-pointer pl-10 [color-scheme:light] dark:[color-scheme:dark]"
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
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground/60 pointer-events-none" />
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

        <div className="pt-1 sm:pt-2">
          <Button
            type="submit"
            className="h-12 w-full rounded-full text-base font-medium shadow-[0_28px_46px_-28px_color-mix(in_oklab,var(--primary)_75%,transparent)] transition-all duration-200 active:scale-[0.97] hover:shadow-xl sm:hover:scale-[1.01]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
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
  const markAsLoan = form.watch(
    transactionFormNames.markAsLoan as Path<FormValues>
  );
  const isOn = Boolean(markAsLoan);

  return (
    <div className={sectionClassName}>
      <FormField
        control={form.control}
        name={transactionFormNames.markAsLoan as Path<FormValues>}
        render={({ field }) => (
          <FormItem className="flex items-center justify-between gap-3 space-y-0">
            <div className="flex items-center gap-3">
              <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                <HandCoinsIcon className="size-4 text-primary" />
              </div>
              <div>
                <FormLabel className="text-sm font-medium text-foreground">
                  Mark as loan
                </FormLabel>
                <FormDescription className="text-xs text-muted-foreground">
                  Track money owed to you (e.g. lent to a friend).
                </FormDescription>
              </div>
            </div>
            <FormControl>
              <Switch
                checked={Boolean(field.value)}
                onCheckedChange={(checked) => field.onChange(checked)}
                aria-label="Mark transaction as loan"
              />
            </FormControl>
          </FormItem>
        )}
      />

      <AnimatePresence initial={false}>
        {isOn && (
          <motion.div
            key="loan-fields"
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
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
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
                    <FormLabel className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70">
                      Due date{" "}
                      <span className="font-normal normal-case tracking-normal text-muted-foreground/50">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        className={cn(
                          inputClassName,
                          "w-full cursor-pointer [color-scheme:light] dark:[color-scheme:dark]"
                        )}
                        value={
                          // @ts-ignore
                          field.value instanceof Date
                            ? format(field.value, "yyyy-MM-dd")
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
      </AnimatePresence>
    </div>
  );
}
