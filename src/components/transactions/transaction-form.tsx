import { format } from "date-fns";
import { CalendarIcon, CheckIcon, ChevronDownIcon } from "lucide-react";
import { useState } from "react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { transactionFormNames } from "~/constants/transaction-form-names";
import { useGetCategoriesByEmail } from "~/hooks/use-get-categories-by-email";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
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
            const value = field.value as string | undefined;
            const selectedCategory = categories?.find(
              (cat) => cat.name === value,
            );

            return (
              <FormItem>
                <FormLabel htmlFor={transactionFormNames.category}>
                  Category
                </FormLabel>
                <FormControl>
                  <Popover open={categoryOpen} onOpenChange={setCategoryOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={categoryOpen}
                        className={cn(
                          "w-full justify-between px-3 font-normal",
                          !value && "text-muted-foreground",
                        )}
                      >
                        {selectedCategory
                          ? selectedCategory.name
                          : "Select category"}
                        <ChevronDownIcon
                          size={16}
                          className="ml-2 text-muted-foreground/80"
                          aria-hidden="true"
                        />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-full p-0" align="start">
                      <Command>
                        <CommandInput placeholder="Search category..." />
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
                                {category.name}
                                {value === category.name && (
                                  <CheckIcon size={16} className="ml-auto" />
                                )}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
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
                <Input
                  id={transactionFormNames.description}
                  placeholder="Add a description for your transaction..."
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
                          !field.value && "text-muted-foreground",
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
        <Button
          type="submit"
          className="w-full cursor-pointer font-black uppercase"
          disabled={isLoading}
        >
          {isLoading ? "Saving..." : buttonText}
        </Button>
      </form>
    </Form>
  );
}
