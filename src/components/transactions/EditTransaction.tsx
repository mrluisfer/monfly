import type { Transaction } from "@prisma/client";
import { useEditTransaction } from "~/hooks/transactions/useEditTransaction";

import { TransactionForm } from "./TransactionForm";

const EditTransaction = ({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) => {
  const { form, onSubmitEditedTransaction, mutation } = useEditTransaction(
    transaction,
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
