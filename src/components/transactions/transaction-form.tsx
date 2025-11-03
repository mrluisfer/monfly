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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
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
        className="space-y-6 p-1"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name={transactionFormNames.amount as Path<FormValues>}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel
                htmlFor={transactionFormNames.amount}
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <DollarSignIcon className="h-4 w-4 text-emerald-600" />
                Amount
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Input
                    id={transactionFormNames.amount}
                    type="number"
                    placeholder="0.00"
                    className="pl-8 text-lg font-medium h-12"
                    {...field}
                    onChange={(e) =>
                      field.onChange(validLimitNumber(e.target.value))
                    }
                  />
                  <DollarSignIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={transactionFormNames.type as Path<FormValues>}
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel
                htmlFor={transactionFormNames.type}
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <SparklesIcon className="h-4 w-4 text-purple-600" />
                Transaction Type
              </FormLabel>
              <FormControl>
                <Select
                  value={field.value as string}
                  onValueChange={(value) =>
                    field.onChange(value as "income" | "expense")
                  }
                >
                  <SelectTrigger className="w-full h-12">
                    <SelectValue placeholder="Select transaction type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">
                      <div className="flex items-center gap-2">
                        <TrendingUpIcon className="h-4 w-4 text-emerald-600" />
                        <span>Income</span>
                      </div>
                    </SelectItem>
                    <SelectItem value="expense">
                      <div className="flex items-center gap-2">
                        <TrendingDownIcon className="h-4 w-4 text-red-600" />
                        <span>Expense</span>
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
              <FormItem className="space-y-3">
                <FormLabel
                  htmlFor={transactionFormNames.category}
                  className="flex items-center gap-2 text-sm font-medium text-foreground"
                >
                  <TagIcon className="h-4 w-4 text-blue-600" />
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
                            "w-full justify-between px-3 h-12 font-normal capitalize",
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
                      <PopoverContent className="p-0" align="start">
                        <Command>
                          <CommandInput
                            placeholder="Search category..."
                            value={inputValue}
                            onValueChange={setInputValue}
                          />
                          <CommandList>
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
            <FormItem className="space-y-3">
              <FormLabel
                htmlFor={transactionFormNames.description}
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <FileTextIcon className="h-4 w-4 text-orange-600" />
                Description
              </FormLabel>
              <FormControl>
                <div className="relative">
                  <Textarea
                    placeholder="Add a description for your transaction..."
                    id={transactionFormNames.description}
                    className="resize-none pl-10 pt-4 min-h-[100px]"
                    rows={3}
                    {...field}
                  />
                  <FileTextIcon className="absolute left-3 top-4 h-4 w-4 text-muted-foreground" />
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
            <FormItem className="flex flex-col space-y-3">
              <FormLabel
                htmlFor={transactionFormNames.date}
                className="flex items-center gap-2 text-sm font-medium text-foreground"
              >
                <CalendarIcon className="h-4 w-4 text-indigo-600" />
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
                          "w-full h-12 pl-3 text-left font-normal justify-start",
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
                  <PopoverContent className="w-auto p-0" align="start">
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
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full text-base font-medium shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-[1.02]"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <SparklesIcon className="h-4 w-4" />
                {buttonText}
              </div>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}
