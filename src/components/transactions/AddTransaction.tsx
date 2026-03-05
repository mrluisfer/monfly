import { useAddTransaction } from "~/hooks/useAddTransaction";

import Card from "../Card";
import { TransactionForm } from "./TransactionForm";

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
