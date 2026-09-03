import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { fontDisplayAtom, setFontDisplayAtom } from "~/state/atoms";

export const useFontDisplay = () => {
  const fontDisplay = useAtomValue(fontDisplayAtom);
  const setFontDisplay = useSetAtom(setFontDisplayAtom);

  return useMemo(
    () => ({
      fontDisplay,
      onChangeFontDisplay: (value: string) => setFontDisplay(value),
      setFontDisplay: (value: string) => setFontDisplay(value),
    }),
    [fontDisplay, setFontDisplay],
  );
};
