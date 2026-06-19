import { useSyncExternalStore } from "react";

// Tailwind's `lg` breakpoint — everything below (phones + tablets) is treated
// as "not desktop" so callers can offer a denser desktop experience.
const DESKTOP_BREAKPOINT = 1024;

function subscribe(callback: () => void) {
  const mql = window.matchMedia(`(min-width: ${DESKTOP_BREAKPOINT}px)`);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.innerWidth >= DESKTOP_BREAKPOINT;
}

function getServerSnapshot() {
  return false;
}

/** `true` on viewports ≥ 1024px (desktop); `false` on phones and tablets. */
export function useIsDesktop() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
