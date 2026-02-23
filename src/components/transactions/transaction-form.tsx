import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCategoryIconByName } from "~/constants/categories-icon";
import { transactionFormNames } from "~/constants/forms/transaction-form-names";
import { useGetCategoriesByEmail } from "~/hooks/use-get-categories-by-email";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { postCategoryByEmailServer } from "~/lib/api/category/post-category-by-email.server";
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
import { toast } from "sonner";

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

export function TransactionForm<FormValues extends FieldValues>({
  form,
  onSubmit,
  buttonText = "Save",
  description,
  showDateDescription = false,
  isLoading = false,
}: TransactionFormProps<FormValues>) {
  const [categoryOpen, setCategoryOpen] = useState(false);
  const { data: categories, isPending, error } = useGetCategoriesByEmail();
  const userEmail = useRouteUser();

  const queryClient = useQueryClient();

  const postCategoryByEmail = useMutation({
    fn: postCategoryByEmailServer,
    onSuccess: async () => {
      toast.success("Category created successfully");
      // Invalidate all queries that depend on category data
      await invalidateCategoryQueries(queryClient, userEmail);
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 sm:space-y-5"
        autoComplete="off"
      >
        {/* Amount + Type row */}
        <div className="flex flex-col gap-4 sm:flex-row sm:gap-3">
          <FormField
            control={form.control}
            name={transactionFormNames.amount as Path<FormValues>}
            render={({ field }) => (
              <FormItem className="space-y-2 flex-1">
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
                      placeholder="0.00"
                      className="h-11 pl-8 text-base font-medium sm:h-12 sm:text-lg"
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
                <FormItem className="space-y-2 sm:w-[200px]">
                  <FormLabel className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                    <SparklesIcon className="size-3.5 text-purple-600" />
                    Type
                  </FormLabel>
                  <FormControl>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => field.onChange("income")}
                        className={cn(
                          "flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition-all duration-200 active:scale-95 sm:h-12",
                          currentType === "income"
                            ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                            : "border-input bg-background text-muted-foreground hover:bg-muted/50"
                        )}
                      >
                        <TrendingUpIcon className="size-4" />
                        Income
                      </button>
                      <button
                        type="button"
                        onClick={() => field.onChange("expense")}
                        className={cn(
                          "flex h-11 items-center justify-center gap-1.5 rounded-lg border text-sm font-medium transition-all duration-200 active:scale-95 sm:h-12",
                          currentType === "expense"
                            ? "border-red-500/50 bg-red-500/10 text-red-600 dark:text-red-400"
                            : "border-input bg-background text-muted-foreground hover:bg-muted/50"
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

        <FormField
          control={form.control}
          name={transactionFormNames.category as Path<FormValues>}
          render={({ field }) => {
            const [inputValue, setInputValue] = useState("");
            const value = field.value as string | undefined;
            const selectedCategory = categories?.find(
              (cat) => cat.name === value
            );

            const showAddNew =
              inputValue.length > 1 &&
              !categories?.some(
                (cat) => cat.name.toLowerCase() === inputValue.toLowerCase()
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
                    <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={categoryOpen}
                          className={cn(
                            "h-11 w-full justify-between px-3 text-sm font-normal capitalize sm:h-12",
                            !value && "text-muted-foreground"
                          )}
                        >
                          {selectedCategory ? (
                            <div className="flex items-center gap-2">
                              {getCategoryIconByName(selectedCategory.icon, {
                                size: 16,
                              })}
                              <span>{selectedCategory.name}</span>
                            </div>
                          ) : (
                            <span>{inputValue || "Select a category"}</span>
                          )}
                          <ChevronDownIcon
                            size={16}
                            className="ml-2 text-muted-foreground"
                            aria-hidden="true"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-(--radix-popover-trigger-width) p-0"
                        align="start"
                      >
                        <Command>
                          <CommandInput
                            placeholder="Search category..."
                            value={inputValue}
                            onValueChange={setInputValue}
                          />
                          <CommandList className="max-h-[230px] sm:max-h-[300px]">
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {categories?.map((category) => (
                                <CommandItem
                                  key={category.name}
                                  value={category.name}
                                  onSelect={(currentValue: string) => {
                                    field.onChange(currentValue);
                                    setCategoryOpen(false);
                                  }}
                                  className="capitalize"
                                >
                                  {getCategoryIconByName(category.icon, {
                                    size: 16,
                                  })}
                                  <span>{category.name}</span>
                                  {value === category.name && (
                                    <CheckIcon size={16} className="ml-auto" />
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
                                      field.onChange(inputValue);
                                      setCategoryOpen(false);
                                      await postCategoryByEmail.mutate({
                                        data: {
                                          email: userEmail,
                                          category: {
                                            name: inputValue,
                                            icon: "other",
                                          },
                                        },
                                      });
                                    }}
                                    value={inputValue}
                                  >
                                    <PlusIcon
                                      size={16}
                                      className="text-green-600"
                                    />
                                    <span>Create "{inputValue}"</span>
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
                    className="min-h-20 resize-none pl-10 pt-3.5 text-sm sm:min-h-[110px] sm:pt-4 sm:text-base"
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
              {isPending && <div>Loading...</div>}
              {error && <div>Error: {error?.message}</div>}
              {categories && (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "h-11 w-full justify-start pl-3 text-left text-sm font-normal sm:h-12 sm:text-base",
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
                  </PopoverTrigger>
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
        <div className="pt-2 sm:pt-4">
          <Button
            type="submit"
            className="h-12 w-full rounded-xl text-base font-medium shadow-lg transition-all duration-200 active:scale-[0.97] hover:shadow-xl sm:hover:scale-[1.02]"
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
