import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

function getSnapshot() {
  if (typeof navigator === "undefined") return false;
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ??
    navigator.platform ??
    "";
  return /Mac|iPhone|iPad|iPod/i.test(platform);
}

/**
 * Detects whether the current platform is Apple-based (Mac/iOS).
 * Returns false on the server and on first render to keep markup stable,
 * then updates on the client after hydration.
 */
export function useIsMac() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
