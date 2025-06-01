import { z } from "zod";
import { transactionFormNames } from "~/constants/transaction-form-names";

export const TransactionFormSchema = z.object({
	[transactionFormNames.amount]: z
		.string()
		.min(0, { message: "Amount must be a positive number" })
		.max(1000000, { message: "Amount must be less than 1,000,000" }),
	[transactionFormNames.type]: z.enum(["income", "expense"], {
		errorMap: () => ({ message: "Type must be either income or expense" }),
	}),
	[transactionFormNames.category]: z
		.string()
		.min(1, { message: "Category is required" }),
	[transactionFormNames.description]: z.string().optional(),
	[transactionFormNames.date]: z.date().optional(),
});
