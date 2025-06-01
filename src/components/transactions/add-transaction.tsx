import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { transactionFormNames } from "~/constants/transaction-form-names";
import { postTransactionByEmail } from "~/lib/api/transactionByEmail";
import { fetchUser } from "~/utils/auth/fetch-user";
import { TransactionFormSchema } from "~/zod-schemas/transaction-schema";
import Card from "../card";
import { TransactionForm } from "./transaction-form";

type FormValues = z.infer<typeof TransactionFormSchema>;

const AddTransaction = () => {
	const form = useForm<FormValues>({
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		resolver: zodResolver(TransactionFormSchema as any),
		defaultValues: {
			[transactionFormNames.type]: "income",
			[transactionFormNames.date]: new Date(),
		},
	});

	const onSubmit = async (data: FormValues) => {
		try {
			const user = await fetchUser();
			if (!user?.email) {
				throw new Error("User email not found");
			}
			const transformedData: Prisma.TransactionCreateInput = {
				amount: Number.parseFloat(data.amount),
				type: data.type,
				category: data.category,
				description: data.description || null,
				date: data.date || new Date(),
				user: {
					connect: {
						email: user.email,
					},
				},
			};
			const { success } = await postTransactionByEmail(
				user.email,
				transformedData,
			);
			if (success) {
				toast.success("Transaction created successfully");
				form.reset();
			} else {
				toast.error("Failed to create transaction");
			}
		} catch (error) {
			console.error("Error creating transaction:", error);
		}
	};

	return (
		<Card className="">
			<h2>Transactions</h2>
			{/* <Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name={transactionFormNames.amount}
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
						name={transactionFormNames.type}
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={transactionFormNames.type}>Type</FormLabel>
								<FormControl>
									<Select
										{...field}
										onValueChange={(value) =>
											field.onChange(value as "income" | "expense")
										}
									>
										<SelectTrigger>
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
						name={transactionFormNames.category}
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
						name={transactionFormNames.description}
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
						name={transactionFormNames.date}
						render={({ field }) => (
							<FormItem className="flex flex-col">
								<FormLabel>Date of birth</FormLabel>
								<Popover>
									<PopoverTrigger asChild>
										<FormControl>
											<Button
												variant={"outline"}
												className={cn(
													"w-[240px] pl-3 text-left font-normal",
													!field.value && "text-muted-foreground",
												)}
											>
												{field.value ? (
													format(field.value, "PPP")
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
											selected={field.value}
											onSelect={field.onChange}
											disabled={(date: Date) =>
												date > new Date() || date < new Date("1900-01-01")
											}
											initialFocus
										/>
									</PopoverContent>
								</Popover>
								<FormDescription>
									Your date of birth is used to calculate your age.
								</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button
						type="submit"
						className="w-full cursor-pointer font-black uppercase"
					>
						Save
					</Button>
				</form>
			</Form> */}
			<TransactionForm
				form={form}
				onSubmit={onSubmit}
				buttonText="Save"
				description="Add a new transaction"
			/>
		</Card>
	);
};

export default AddTransaction;
