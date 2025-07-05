import type { Transaction } from "@prisma/client";
import { useEditTransaction } from "~/hooks/use-edit-transaction";

import { TransactionForm } from "./transaction-form";

const EditTransaction = ({
  transaction,
  onClose,
}: {
  transaction: Transaction;
  onClose: () => void;
}) => {
  const { form, onSubmitEditedTransaction } = useEditTransaction(
    transaction,
    onClose
  );

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
