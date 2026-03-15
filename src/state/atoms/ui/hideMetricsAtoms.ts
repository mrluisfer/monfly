import { atomWithStorage } from "jotai/utils";

export const hideMetricsAtom = atomWithStorage<boolean>(
  "monfly-hide-metrics",
  false
);
