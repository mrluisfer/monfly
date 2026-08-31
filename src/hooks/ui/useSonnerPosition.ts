import { useAtomValue, useSetAtom } from "jotai";
import { useMemo } from "react";
import { setSonnerPositionAtom, sonnerPositionAtom } from "~/state/atoms";
import type { SonnerPosition } from "~/types/SonnerPosition";

export const useSonnerPosition = () => {
  const position = useAtomValue(sonnerPositionAtom);
  const setPosition = useSetAtom(setSonnerPositionAtom);

  return useMemo(
    () => ({
      position,
      setPosition: (nextPosition: SonnerPosition) => setPosition(nextPosition),
    }),
    [position, setPosition],
  );
};
