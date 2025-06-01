import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import type { FieldValues, Path, UseFormReturn } from "react-hook-form";
import { transactionFormNames } from "~/constants/transaction-form-names";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { Calendar } from "../ui/calendar";
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
					render={({ field }) => (
						<FormItem>
							<FormLabel htmlFor={transactionFormNames.category}>
								Category
							</FormLabel>
							<FormControl>
								<Input id={transactionFormNames.category} {...field} />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
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
								<Input id={transactionFormNames.description} {...field} />
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
										// onSelect={(day) => {
										// 	if (day) {
										// 		const dateParsed = new Date(day);
										// 		field.onChange(dateParsed);
										// 	}
										// }}
										onSelect={field.onChange}
										disabled={(date: Date) =>
											date > new Date() || date < new Date("1900-01-01")
										}
										initialFocus
									/>
								</PopoverContent>
							</Popover>
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
