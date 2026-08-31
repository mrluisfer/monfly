import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import type { NumberFormatId } from "~/constants/number-formats";
import { numberFormatAtom, setNumberFormatAtom } from "~/state/atoms";

export const useNumberFormat = () => {
  const format = useAtomValue(numberFormatAtom);
  const setFormat = useSetAtom(setNumberFormatAtom);

  return useMemo(
    () => ({
      format,
      setFormat: (nextFormat: NumberFormatId) => setFormat(nextFormat),
    }),
    [format, setFormat],
  );
};
