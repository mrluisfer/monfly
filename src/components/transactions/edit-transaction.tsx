import { zodResolver } from "@hookform/resolvers/zod";
import type { Transaction } from "@prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { transactionFormNames } from "~/constants/transaction-form-names";
import { useMutation } from "~/hooks/use-mutation";
import { putTransactionByIdServer } from "~/lib/api/transaction/put-transaction-by-id.server";
import { TransactionFormSchema } from "~/zod-schemas/transaction-schema";
import { TransactionForm } from "./transaction-form";

const EditTransaction = ({
	transaction,
	onClose,
}: {
	transaction: Transaction;
	onClose: () => void;
}) => {
	const queryClient = useQueryClient();

	const form = useForm<z.infer<typeof TransactionFormSchema>>({
		// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		resolver: zodResolver(TransactionFormSchema as any),
		defaultValues: {
			[transactionFormNames.amount]: transaction.amount.toString(),
			[transactionFormNames.type]: transaction.type as "income" | "expense",
			[transactionFormNames.category]: transaction.category,
			[transactionFormNames.description]: transaction.description ?? "",
			[transactionFormNames.date]: transaction.date,
		},
	});

	const putTransactionByIdMutation = useMutation({
		fn: putTransactionByIdServer,
		onSuccess: (ctx) => {
			if (ctx.data?.error) {
				toast.error(ctx.data.message);
				return;
			}
			toast.success(ctx.data.message);
			onClose();
			queryClient.invalidateQueries({
				queryKey: ["transactions", transaction.userEmail],
			});
		},
	});

	const onSubmitEditedTransaction = async (
		data: z.infer<typeof TransactionFormSchema>,
	) => {
		try {
			await putTransactionByIdMutation.mutate({
				data: {
					id: transaction.id,
					data: {
						amount: Number.parseFloat(data.amount),
						type: data.type,
						category: data.category,
						description: data.description || "",
						date: data.date || new Date(),
					},
				},
			});
		} catch (error) {
			toast.error("Error editing transaction");
		}
	};

	return (
		<div>
			<TransactionForm
				form={form}
				onSubmit={onSubmitEditedTransaction}
				buttonText="Save"
				description="Edit a transaction"
			/>
		</div>
	);
};

export default EditTransaction;
