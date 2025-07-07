import { useAddTransaction } from "~/hooks/use-add-transaction";

import Card from "../card";
import { TransactionForm } from "./transaction-form";

const AddTransaction = () => {
  const { form, onSubmit } = useAddTransaction();

  return (
    <Card title="Add Transaction" subtitle="Create a new transaction">
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
