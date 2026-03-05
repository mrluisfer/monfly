import { useMemo } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import type { SonnerPosition } from "~/types/SonnerPosition";
import { setSonnerPositionAtom, sonnerPositionAtom } from "~/state/atoms";

export const useSonnerPosition = () => {
  const position = useAtomValue(sonnerPositionAtom);
  const setPosition = useSetAtom(setSonnerPositionAtom);

  return useMemo(
    () => ({
      position,
      setPosition: (nextPosition: SonnerPosition) => setPosition(nextPosition),
    }),
    [position, setPosition]
  );
};
