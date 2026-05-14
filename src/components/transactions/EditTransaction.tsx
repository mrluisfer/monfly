import type { Transaction } from "@prisma/client";
import { useEditTransaction } from "~/hooks/transactions/useEditTransaction";

import { TransactionForm } from "./TransactionForm";

type EditableTransaction = Omit<Transaction, "appliedToLoanId"> & {
  appliedToLoanId?: string | null;
};

const EditTransaction = ({
  transaction,
  onClose,
}: {
  transaction: EditableTransaction;
  onClose: () => void;
}) => {
  const normalizedTransaction: Transaction = {
    ...transaction,
    appliedToLoanId: transaction.appliedToLoanId ?? null,
  };
  const { form, onSubmitEditedTransaction, mutation } = useEditTransaction(
    normalizedTransaction,
    onClose,
  );

  return (
    <div>
      <TransactionForm
        form={form}
        onSubmit={onSubmitEditedTransaction}
        buttonText="Save changes"
        description="Edit a transaction"
        isLoading={mutation.status === "pending"}
      />
    </div>
  );
};

export default EditTransaction;
