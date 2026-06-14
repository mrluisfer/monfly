import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * Returns `false` during server render and the initial client render, then
 * `true` after the component has mounted. Use to gate UI that depends on
 * client-only state (e.g. `localStorage`-backed atoms) so the first client
 * render matches the server HTML and avoids hydration mismatches.
 */
export const useIsMounted = () =>
  useSyncExternalStore(
    subscribe,
    () => true,
    () => false,
  );
