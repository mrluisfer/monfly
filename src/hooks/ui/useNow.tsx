import { useCallback, useRef, useSyncExternalStore } from "react";

/**
 * A timestamp that advances on an interval so relative-time labels
 * ("3 minutes ago") keep re-rendering instead of freezing at the value they
 * had on first paint. Returns `null` during server render and the first client
 * render so SSR output stays deterministic (no hydration mismatch), then starts
 * ticking once mounted — mirroring how `useIsMounted` flips after hydration.
 *
 * Built on `useSyncExternalStore` (rather than `useState` + `useEffect`) so the
 * snapshot stays cached between ticks and we never call `setState` inside an
 * effect. Default cadence is 30s — fine enough that "just now" rolls over to
 * "1 minute ago" without a noticeable lag, cheap enough to leave running.
 */
export function useNow(intervalMs = 30_000): number | null {
  const cached = useRef<number | null>(null);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      const id = setInterval(() => {
        cached.current = Date.now();
        onStoreChange();
      }, intervalMs);
      return () => clearInterval(id);
    },
    [intervalMs],
  );

  const getSnapshot = useCallback(() => {
    // Seed once on the first client read, then only the interval moves it — so
    // the snapshot is stable between ticks and React doesn't loop.
    if (cached.current === null) cached.current = Date.now();
    return cached.current;
  }, []);

  const getServerSnapshot = useCallback(() => null, []);

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
