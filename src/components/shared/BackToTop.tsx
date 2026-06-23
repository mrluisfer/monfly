import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpIcon } from "lucide-react";
import {
  type RefObject,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { Button } from "~/components/ui/button";
import { cn } from "~/lib/utils";

/** A ref to the scroll element, or a CSS selector resolved against the document. */
type ScrollTarget = RefObject<HTMLElement | null> | string;

type BackToTopProps = {
  /**
   * Explicit scroll element to control — a ref or CSS selector. Omit it and the
   * component auto-detects the nearest scrollable ancestor, falling back to the
   * window. (The app scrolls the document, not an inner container, so a
   * hard-coded `#main-content` would be a no-op — hence the detection.)
   */
  target?: ScrollTarget;
  /**
   * - `"floating"` (default): a fixed FAB that fades in once scrolled past
   *   `threshold`.
   * - `"inline"`: rendered in the normal flow — drop it at the end of a list so
   *   reaching the bottom reveals it and a tap returns to the top.
   */
  variant?: "floating" | "inline";
  /** Pixels scrolled before the floating button reveals itself. */
  threshold?: number;
  /** Render just the arrow (a compact FAB) instead of the labelled pill. */
  iconOnly?: boolean;
  /** Accessible label / tooltip and pill text. */
  label?: string;
  /** Floating: overrides the fixed placement. Inline: classes for the wrapper. */
  className?: string;
};

function resolveExplicitTarget(target?: ScrollTarget): HTMLElement | null {
  if (typeof document === "undefined" || !target) return null;
  if (typeof target === "string") {
    return document.querySelector<HTMLElement>(target);
  }
  return target.current;
}

function isScrollable(element: HTMLElement): boolean {
  if (element.scrollHeight <= element.clientHeight) return false;
  const overflowY = getComputedStyle(element).overflowY;
  return (
    overflowY === "auto" || overflowY === "scroll" || overflowY === "overlay"
  );
}

/** Walks up from `node` to the first ancestor that actually scrolls its overflow. */
function getScrollableAncestor(node: HTMLElement | null): HTMLElement | null {
  let element = node?.parentElement ?? null;
  while (element) {
    if (isScrollable(element)) return element;
    element = element.parentElement;
  }
  return null;
}

/**
 * "Back to top" control that returns the active scroll container to the top.
 *
 * It resolves the real scroller (explicit `target` → nearest scrollable
 * ancestor → window) instead of assuming one, so it works whether the page
 * scrolls the document or an inner `overflow` region. Use `variant="floating"`
 * for a scroll-aware FAB, or `variant="inline"` to anchor it at the end of a
 * long list.
 */
export function BackToTop({
  target,
  variant = "floating",
  threshold = 320,
  iconOnly = false,
  label = "Back to top",
  className,
}: BackToTopProps) {
  const isFloating = variant === "floating";
  const [isVisible, setIsVisible] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const scrollerRef = useRef<HTMLElement | Window | null>(null);
  const prefersReducedMotion = useReducedMotion();

  const resolveScroller = useCallback(
    (): HTMLElement | Window =>
      resolveExplicitTarget(target) ??
      getScrollableAncestor(rootRef.current) ??
      window,
    [target],
  );

  useEffect(() => {
    const scroller = resolveScroller();
    scrollerRef.current = scroller;

    // Inline lives in the flow and is always present — only the floating FAB
    // needs to track scroll position to decide when to appear.
    if (!isFloating) return;

    const getScrollTop = () =>
      scroller === window
        ? window.scrollY
        : (scroller as HTMLElement).scrollTop;

    const handleScroll = () => setIsVisible(getScrollTop() > threshold);

    // Initialize in case the view is already scrolled (route change, refresh).
    handleScroll();
    scroller.addEventListener("scroll", handleScroll, { passive: true });
    return () => scroller.removeEventListener("scroll", handleScroll);
  }, [threshold, isFloating, resolveScroller]);

  const scrollToTop = useCallback(() => {
    const scroller = scrollerRef.current ?? resolveScroller();
    scroller.scrollTo({
      top: 0,
      behavior: prefersReducedMotion ? "auto" : "smooth",
    });
  }, [prefersReducedMotion, resolveScroller]);

  const button = (
    <Button
      type="button"
      variant="secondary"
      size={iconOnly ? "icon" : "sm"}
      onClick={scrollToTop}
      aria-label={label}
      title={label}
      className={cn(
        "rounded-full",
        isFloating && "border-border/60 border shadow-lg backdrop-blur",
      )}
    >
      <ArrowUpIcon aria-hidden="true" />
      {!iconOnly && <span>{label}</span>}
    </Button>
  );

  if (!isFloating) {
    return (
      <div ref={rootRef} className={cn("flex justify-center py-1", className)}>
        {button}
      </div>
    );
  }

  return (
    // `contents` keeps a stable DOM anchor for ancestor detection without
    // adding a box, while the button itself is portaled into a fixed corner.
    <div ref={rootRef} className="contents">
      <AnimatePresence>
        {isVisible && (
          <motion.div
            initial={
              prefersReducedMotion ? false : { opacity: 0, y: 12, scale: 0.9 }
            }
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, y: 12, scale: 0.9 }
            }
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={cn("fixed right-5 bottom-6 z-50", className)}
          >
            {button}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
