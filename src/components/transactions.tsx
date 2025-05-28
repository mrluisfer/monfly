import { prismaClient } from "@/utils/prisma";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import React, { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { postTransactionByEmail } from "~/lib/api/postTransactionByEmail";
import { fetchUser } from "~/utils/auth/fetch-user";
import { Button } from "./ui/button";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

const formNames = {
	amount: "amount",
	type: "type",
	category: "category",
	description: "description",
	date: "date",
} as const;

const FormSchema = z.object({
	[formNames.amount]: z
		.string()
		.min(0, { message: "Amount must be a positive number" })
		.max(1000000, { message: "Amount must be less than 1,000,000" }),
	[formNames.type]: z.enum(["income", "expense"], {
		errorMap: () => ({ message: "Type must be either income or expense" }),
	}),
	[formNames.category]: z.string().min(1, { message: "Category is required" }),
	[formNames.description]: z.string().optional(),
	[formNames.date]: z.date().optional(),
});

type FormValues = z.infer<typeof FormSchema>;

const Transactions = () => {
	const form = useForm<FormValues>({
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		resolver: zodResolver(FormSchema as any),
		defaultValues: {
			[formNames.type]: "income",
			[formNames.date]: new Date(),
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
			await postTransactionByEmail(user.email, transformedData);
			form.reset();
		} catch (error) {
			console.error("Error creating transaction:", error);
		}
	};

	return (
		<div className="max-w-xl p-4 border-2 rounded-lg">
			<h2>Transactions</h2>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)}>
					<FormField
						control={form.control}
						name={formNames.amount}
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={formNames.amount}>Amount</FormLabel>
								<FormControl>
									<Input id={formNames.amount} type="number" {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={formNames.type}
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={formNames.type}>Type</FormLabel>
								<FormControl>
									<select
										id={formNames.type}
										{...field}
										className="w-full p-2 border rounded"
									>
										<option value="income">Income</option>
										<option value="expense">Expense</option>
									</select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={formNames.category}
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={formNames.category}>Category</FormLabel>
								<FormControl>
									<Input id={formNames.category} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={formNames.description}
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={formNames.description}>
									Description
								</FormLabel>
								<FormControl>
									<Input id={formNames.description} {...field} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name={formNames.date}
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor={formNames.date}>Date</FormLabel>
								<FormControl>
									<Input
										type="date"
										{...field}
										value={field.value?.toISOString().split("T")[0]}
										onChange={(e) => field.onChange(new Date(e.target.value))}
									/>
								</FormControl>
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
			</Form>
		</div>
	);
};

export default Transactions;
