import { useEffect } from "react";

import { useAppHaptics } from "./useAppHaptics";

const INTERACTIVE_HAPTIC_SELECTOR = [
  "button",
  "[data-slot='button']",
  "[data-slot='toggle']",
  "[data-slot='switch']",
  "[data-slot='dialog-trigger']",
  "[data-slot='sheet-trigger']",
  "[data-slot='popover-trigger']",
  "[data-slot='dropdown-menu-trigger']",
  "[data-slot='select-trigger']",
  "[data-slot='tabs-trigger']",
  "[data-slot='accordion-trigger']",
  "a[href]",
  "[role='button']",
  "[role='menuitem']",
  "[role='switch']",
  "[role='tab']",
  "[role='radio']",
  "input[type='checkbox']",
  "input[type='radio']",
  "summary",
  "[data-haptic='selection']",
].join(", ");

function isDisabledElement(element: HTMLElement) {
  return (
    element.hasAttribute("disabled") ||
    element.getAttribute("aria-disabled") === "true" ||
    element.getAttribute("data-disabled") === "true"
  );
}

export function useGlobalHapticFeedback() {
  const { selection } = useAppHaptics();

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    let lastHapticTime = 0;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      if (target.closest("[data-no-haptics='true']")) {
        return;
      }

      if (target.closest("[data-haptic-handled='true']")) {
        return;
      }

      const interactiveElement = target.closest(INTERACTIVE_HAPTIC_SELECTOR);
      if (!(interactiveElement instanceof HTMLElement)) {
        return;
      }

      if (isDisabledElement(interactiveElement)) {
        return;
      }

      const now = Date.now();
      if (now - lastHapticTime < 40) {
        return;
      }

      lastHapticTime = now;
      void selection();
    };

    document.addEventListener("click", handleClick, true);
    return () => {
      document.removeEventListener("click", handleClick, true);
    };
  }, [selection]);
}
