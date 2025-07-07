import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getCategoryIconByName } from "~/constants/categories-icon";
import { transactionFormNames } from "~/constants/transaction-form-names";
import { useGetCategoriesByEmail } from "~/hooks/use-get-categories-by-email";
import { useMutation } from "~/hooks/use-mutation";
import { useRouteUser } from "~/hooks/use-route-user";
import { postCategoryByEmailServer } from "~/lib/api/category/post-category-by-email.server";
import { cn } from "~/lib/utils";
import { queryDictionary } from "~/queries/dictionary";
import { validLimitNumber } from "~/utils/valid-limit-number";
import { format } from "date-fns";
import {
  CalendarIcon,
  CheckIcon,
  ChevronDownIcon,
  PlusIcon,
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
      await queryClient.invalidateQueries({
        queryKey: [queryDictionary.categories],
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
        autoComplete="off"
      >
        <FormField
          control={form.control}
          name={transactionFormNames.amount as Path<FormValues>}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={transactionFormNames.amount}>
                Amount
              </FormLabel>
              <FormControl>
                <Input
                  id={transactionFormNames.amount}
                  type="number"
                  placeholder="0.00"
                  {...field}
                  onChange={(e) =>
                    field.onChange(validLimitNumber(e.target.value))
                  }
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={transactionFormNames.type as Path<FormValues>}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={transactionFormNames.type}>Type</FormLabel>
              <FormControl>
                <Select
                  value={field.value as string}
                  onValueChange={(value) =>
                    field.onChange(value as "income" | "expense")
                  }
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="income">Income</SelectItem>
                    <SelectItem value="expense">Expense</SelectItem>
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
              <FormItem>
                <FormLabel htmlFor={transactionFormNames.category}>
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
                            "w-full justify-between px-3 font-normal capitalize",
                            !value && "text-muted-foreground"
                          )}
                        >
                          {selectedCategory
                            ? selectedCategory.name
                            : inputValue || "Select a category"}
                          <ChevronDownIcon
                            size={16}
                            className="ml-2 text-muted-foreground/80"
                            aria-hidden="true"
                          />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0" align="center">
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
                                    size: 10,
                                  })}
                                  {category.name}
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
                                    <PlusIcon size={16} className="mr-1" />
                                    Add new:{" "}
                                    <span className="ml-1 font-semibold">
                                      {inputValue}
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

        <FormField
          control={form.control}
          name={transactionFormNames.description as Path<FormValues>}
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={transactionFormNames.description}>
                Description
              </FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Add a description for your transaction..."
                  id={transactionFormNames.description}
                  className="resize-none"
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={transactionFormNames.date as Path<FormValues>}
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel htmlFor={transactionFormNames.date}>Date</FormLabel>
              {isPending && <div>Loading...</div>}
              {error && <div>Error: {error?.message}</div>}
              {categories && (
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value as Date, "PPP")
                        ) : (
                          <span className="text-muted-foreground">
                            Pick a date
                          </span>
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
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
