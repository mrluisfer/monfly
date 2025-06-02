import { zodResolver } from "@hookform/resolvers/zod";
import type { Prisma } from "@prisma/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { transactionFormNames } from "~/constants/transaction-form-names";
import { useMutation } from "~/hooks/use-mutation";
import { postTransactionByEmailServer } from "~/lib/api/transaction/post-transaction-by-email.server";
import { getUserSession } from "~/utils/user/get-user-session";
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

	const postTransactionByEmail = useMutation({
		fn: postTransactionByEmailServer,
		onSuccess: () => {
			toast.success("Transaction created successfully");
			form.reset();
		},
	});

	const onSubmit = async (data: FormValues) => {
		try {
			const { data: userEmail } = await getUserSession();
			if (!userEmail) {
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
						email: userEmail,
					},
				},
			};
			await postTransactionByEmail.mutate({
				data: {
					email: userEmail,
					transaction: {
						...transformedData,
						date: new Date(transformedData.date),
					},
				},
			});
			if (postTransactionByEmail.status === "success") {
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
