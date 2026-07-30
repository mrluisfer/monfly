import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import {
  disableTransactionHoverAtom,
  setDisableTransactionHoverAtom,
} from "~/state/atoms";

export const useTransactionHoverContext = () => {
  const disableHover = useAtomValue(disableTransactionHoverAtom);
  const setDisableHover = useSetAtom(setDisableTransactionHoverAtom);

  return useMemo(
    () => ({
      disableHover,
      setDisableHover: (value: boolean) => setDisableHover(value),
    }),
    [disableHover, setDisableHover],
  );
};
