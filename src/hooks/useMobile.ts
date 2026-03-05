import { useAtomValue } from "jotai";
import { isMobileAtom } from "~/state/atoms";

export function useIsMobile() {
  return useAtomValue(isMobileAtom);
}
