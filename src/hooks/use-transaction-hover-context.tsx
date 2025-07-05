import { useContext } from "react";
import { TransactionHoverContext } from "~/context/transaction-hover-provider";

export const useTransactionHoverContext = () => {
  const context = useContext(TransactionHoverContext);
  if (!context) {
    throw new Error(
      "useTransactionHoverContext must be used within a TransactionHoverProvider"
    );
  }
  return context;
};
