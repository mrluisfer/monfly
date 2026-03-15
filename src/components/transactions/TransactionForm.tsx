import { useEffect, useId, useRef, useState, type FocusEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCategoryIconByName } from "~/constants/categories-icon";
import { transactionFormNames } from "~/constants/forms/transaction-form-names";
import { useAppHaptics } from "~/hooks/useAppHaptics";
import { useGetCategoriesByEmail } from "~/hooks/useGetCategoriesByEmail";
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
  CheckIcon,
  ChevronDownIcon,
  DollarSignIcon,
  FileTextIcon,
  PlusIcon,
  SparklesIcon,
  TagIcon,
  TrendingDownIcon,
  TrendingUpIcon,
} from "lucide-react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";

import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "../ui/command";
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
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { Textarea } from "../ui/textarea";

type TransactionFormProps<FormValues extends FieldValues> = {
  form: UseFormReturn<FormValues>;
  onSubmit: (data: FormValues) => void;
  buttonText?: string;
  description?: string;
  showDateDescription?: boolean;
  isLoading?: boolean;
};

export const transactionFormDialogContentClassName =
  "finance-dialog-sheet top-auto bottom-0 w-[calc(100vw-0.75rem)] !max-w-[calc(100vw-0.75rem)] -translate-y-0 rounded-t-[2rem] rounded-b-none p-0 sm:top-1/2 sm:bottom-auto sm:w-[calc(100vw-2rem)] sm:!max-w-2xl sm:-translate-y-1/2 sm:rounded-[1.8rem] md:!max-w-3xl lg:!max-w-[58rem] xl:!max-w-[66rem]";

const sectionClassName =
  "rounded-[1.45rem] border border-border/70 bg-background/70 p-4 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35)] sm:p-5";
const inputClassName =
  "h-12 rounded-[1.05rem] border-border/70 bg-background/65 text-base shadow-none sm:text-base";
const toggleButtonClassName =
  "flex h-12 items-center justify-center gap-1.5 rounded-[1.05rem] border text-sm font-medium transition-all duration-200 active:scale-95 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50";

export function TransactionForm<FormValues extends FieldValues>({
  form,
  onSubmit,
  buttonText = "Save",
  description,
  showDateDescription = false,
  isLoading = false,
}: TransactionFormProps<FormValues>) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const [categoryInputValue, setCategoryInputValue] = useState("");
  const [keyboardInset, setKeyboardInset] = useState(0);
  const focusScrollTimeoutRef = useRef<number | null>(null);
  const categoryComboboxId = useId();
  const typeLabelId = useId();
  const { data: categories, isPending, error } = useGetCategoriesByEmail();
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
        <div className={sectionClassName}>
          <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
            <FormField
              control={form.control}
              name={transactionFormNames.amount as Path<FormValues>}
              render={({ field }) => (
                <FormItem className="flex-1 space-y-2">
                  <FormLabel
                    htmlFor={transactionFormNames.amount}
                    className="flex items-center gap-1.5 text-sm font-medium text-foreground"
                  >
                    <DollarSignIcon className="size-3.5 text-emerald-600" />
                    Amount
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        id={transactionFormNames.amount}
                        type="number"
                        inputMode="decimal"
                        step="0.01"
                        placeholder="0.00"
                        className={cn(inputClassName, "pl-10 font-semibold")}
                        {...field}
                        onChange={(e) =>
                          field.onChange(validLimitNumber(e.target.value))
                        }
                      />
                      <DollarSignIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
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
                  <FormItem className="space-y-2 sm:w-52">
                    <FormLabel
                      id={typeLabelId}
                      className="flex items-center gap-1.5 text-sm font-medium text-foreground"
                    >
                      <SparklesIcon className="size-3.5 text-purple-600" />
                      Type
                    </FormLabel>
                    <FormControl>
                      <div
                        className="grid grid-cols-2 gap-2"
                        role="radiogroup"
                        aria-labelledby={typeLabelId}
                      >
                        <button
                          type="button"
                          role="radio"
                          aria-checked={currentType === "income"}
                          onClick={() => field.onChange("income")}
                          className={cn(
                            toggleButtonClassName,
                            currentType === "income"
                              ? "border-emerald-500/40 bg-emerald-500/12 text-emerald-700 dark:text-emerald-300"
                              : "border-border/70 bg-background/65 text-muted-foreground hover:bg-muted/50"
                          )}
                        >
                          <TrendingUpIcon className="size-4" />
                          Income
                        </button>
                        <button
                          type="button"
                          role="radio"
                          aria-checked={currentType === "expense"}
                          onClick={() => field.onChange("expense")}
                          className={cn(
                            toggleButtonClassName,
                            currentType === "expense"
                              ? "border-red-500/40 bg-red-500/12 text-red-700 dark:text-red-300"
                              : "border-border/70 bg-background/65 text-muted-foreground hover:bg-muted/50"
                          )}
                        >
                          <TrendingDownIcon className="size-4" />
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
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-start">
          <div className={sectionClassName}>
            <FormField
              control={form.control}
              name={transactionFormNames.category as Path<FormValues>}
              render={({ field }) => {
                const value = field.value as string | undefined;
                const selectedCategory = categories?.find(
                  (cat) => cat.name === value
                );

                const showAddNew =
                  categoryInputValue.length > 1 &&
                  !categories?.some(
                    (cat) =>
                      cat.name.toLowerCase() === categoryInputValue.toLowerCase()
                  );

                return (
                  <FormItem className="space-y-2">
                    <FormLabel
                      htmlFor={transactionFormNames.category}
                      className="flex items-center gap-1.5 text-sm font-medium text-foreground"
                    >
                      <TagIcon className="size-3.5 text-blue-600" />
                      Category
                    </FormLabel>
                    <FormControl>
                      <div className="*:not-first:mt-2 w-full">
                        <Popover
                          open={categoryOpen}
                          onOpenChange={setCategoryOpen}
                        >
                          <PopoverTrigger
                            render={
                              <Button
                                id={transactionFormNames.category}
                                variant="outline"
                                role="combobox"
                                aria-expanded={categoryOpen}
                                aria-controls={`${categoryComboboxId}-listbox`}
                                className={cn(
                                  inputClassName,
                                  "w-full justify-between px-3 text-sm font-normal capitalize",
                                  !value && "text-muted-foreground"
                                )}
                              >
                                {selectedCategory ? (
                                  <div className="flex items-center gap-2">
                                    {getCategoryIconByName(
                                      selectedCategory.icon,
                                      {
                                        size: 16,
                                      }
                                    )}
                                    <span>{selectedCategory.name}</span>
                                  </div>
                                ) : (
                                  <span>
                                    {categoryInputValue || "Select a category"}
                                  </span>
                                )}
                                <ChevronDownIcon
                                  size={16}
                                  className="ml-2 text-muted-foreground"
                                  aria-hidden="true"
                                />
                              </Button>
                            }
                          />
                          <PopoverContent
                            className="w-(--radix-popover-trigger-width) p-0"
                            align="start"
                          >
                            <Command>
                              <CommandInput
                                placeholder="Search category..."
                                value={categoryInputValue}
                                onValueChange={setCategoryInputValue}
                              />
                              <CommandList
                                id={`${categoryComboboxId}-listbox`}
                                className="max-h-57.5 sm:max-h-75"
                              >
                                <CommandEmpty>No category found.</CommandEmpty>
                                <CommandGroup>
                                  {categories?.map((category) => (
                                    <CommandItem
                                      key={category.name}
                                      value={category.name}
                                      onSelect={(currentValue: string) => {
                                        field.onChange(currentValue);
                                        setCategoryInputValue("");
                                        setCategoryOpen(false);
                                      }}
                                      className="capitalize"
                                    >
                                      {getCategoryIconByName(category.icon, {
                                        size: 16,
                                      })}
                                      <span>{category.name}</span>
                                      {value === category.name && (
                                        <CheckIcon
                                          size={16}
                                          className="ml-auto"
                                        />
                                      )}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                                {showAddNew && (
                                  <>
                                    <CommandSeparator />
                                    <CommandGroup heading="Add new category">
                                      <CommandItem
                                        onSelect={async () => {
                                          field.onChange(categoryInputValue);
                                          setCategoryInputValue("");
                                          setCategoryOpen(false);
                                          await postCategoryByEmail.mutate({
                                            data: {
                                              email: userEmail,
                                              category: {
                                                name: categoryInputValue,
                                                icon: "other",
                                              },
                                            },
                                          });
                                        }}
                                        value={categoryInputValue}
                                      >
                                        <PlusIcon
                                          size={16}
                                          className="text-green-600"
                                        />
                                        <span>
                                          Create "{categoryInputValue}"
                                        </span>
                                      </CommandItem>
                                    </CommandGroup>
                                  </>
                                )}
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
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
                    className="flex items-center gap-1.5 text-sm font-medium text-foreground"
                  >
                    <FileTextIcon className="size-3.5 text-orange-600" />
                    Description
                  </FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="Add a description..."
                        id={transactionFormNames.description}
                        className="min-h-24 resize-none rounded-[1.05rem] border-border/70 bg-background/65 pl-10 pt-3.5 text-sm shadow-none sm:pt-4 sm:text-base"
                        rows={2}
                        {...field}
                      />
                      <FileTextIcon className="absolute left-3 top-3.5 size-4 text-muted-foreground sm:top-4" />
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
                      className="flex items-center gap-1.5 text-sm font-medium text-foreground"
                    >
                      <CalendarIcon className="size-3.5 text-indigo-600" />
                      Date
                    </FormLabel>
                    {isPending && (
                      <div role="status" aria-live="polite">
                        Loading...
                      </div>
                    )}
                    {error && <div role="alert">Error: {error?.message}</div>}
                    {categories && (
                      <Popover>
                        <PopoverTrigger
                          render={
                            <FormControl>
                              <Button
                                id={transactionFormNames.date}
                                variant={"outline"}
                                className={cn(
                                  inputClassName,
                                  "w-full justify-start pl-3 text-left text-sm font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value as Date, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          }
                        />
                        <PopoverContent
                          className="w-auto max-w-[calc(100vw-2rem)] p-0"
                          align="start"
                        >
                          <Calendar
                            mode="single"
                            selected={field.value as Date}
                            onSelect={field.onChange}
                            disabled={(date: Date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    )}
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
