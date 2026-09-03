import { useSyncExternalStore } from "react";

// The value never changes after mount, so there is nothing to unsubscribe.
const subscribe = () => () => undefined;

const APPLE_PLATFORM = /Mac|iPhone|iPad|iPod/i;

function getSnapshot() {
  if (typeof navigator === "undefined") {
    return false;
  }
  const platform =
    (navigator as Navigator & { userAgentData?: { platform?: string } })
      .userAgentData?.platform ??
    navigator.platform ??
    "";
  return APPLE_PLATFORM.test(platform);
}

/**
 * Detects whether the current platform is Apple-based (Mac/iOS).
 * Returns false on the server and on first render to keep markup stable,
 * then updates on the client after hydration.
 */
export function useIsMac() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
