import { useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { fontDisplayAtom, setFontDisplayAtom } from "~/state/atoms";

export const useFontDisplay = () => {
  const fontDisplay = useAtomValue(fontDisplayAtom);
  const setFontDisplay = useSetAtom(setFontDisplayAtom);

  return useMemo(
    () => ({
      fontDisplay,
      setFontDisplay: (value: string) => setFontDisplay(value),
      onChangeFontDisplay: (value: string) => setFontDisplay(value),
    }),
    [fontDisplay, setFontDisplay]
  );
};
