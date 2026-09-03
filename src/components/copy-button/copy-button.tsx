"use client";

import { CheckIcon, CircleXIcon, ClipboardIcon } from "lucide-react";
import type { HTMLMotionProps, Variants } from "motion/react";
import { AnimatePresence, motion } from "motion/react";
import type { ComponentProps, ReactNode } from "react";

import { Button } from "@/components/ui/button";
import type { CopyState } from "@/hooks/use-copy-to-clipboard";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

export const motionIconVariants: Variants = {
  animate: { filter: "blur(0px)", opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.8 },
  initial: { filter: "blur(2px)", opacity: 0, scale: 0.8 },
};

export const motionIconProps: HTMLMotionProps<"span"> = {
  animate: "animate",
  exit: "exit",
  initial: "initial",
  transition: { duration: 0.15, ease: "easeOut" },
  variants: motionIconVariants,
};

export interface CopyStateIconProps {
  /**
   * Custom icon for done state.
   * @defaultValue CheckIcon
   */
  doneIcon?: React.ReactNode;
  /**
   * Custom icon for error state.
   * @defaultValue CircleXIcon
   */
  errorIcon?: React.ReactNode;
  /**
   * Custom icon for idle state.
   * @defaultValue CopyIcon
   */
  idleIcon?: React.ReactNode;
  state: CopyState;
}

export function CopyStateIcon({
  state,
  idleIcon,
  doneIcon,
  errorIcon,
}: CopyStateIconProps) {
  // One span per state, keyed so AnimatePresence still crossfades between them.
  const icons: Record<CopyState, ReactNode> = {
    done: doneIcon ?? <CheckIcon strokeWidth={3} />,
    error: errorIcon ?? <CircleXIcon />,
    idle: idleIcon ?? <ClipboardIcon />,
  };

  return (
    <AnimatePresence mode="popLayout" initial={false}>
      <motion.span key={state} {...motionIconProps}>
        {icons[state]}
      </motion.span>
    </AnimatePresence>
  );
}

export type CopyButtonProps = ComponentProps<typeof Button> & {
  /** The text to copy, or a function that returns the text. */
  text: string | (() => string);
  /** Called with the copied text on successful copy. */
  onCopySuccess?: (text: string) => void;
  /** Called with the error if the copy operation fails. */
  onCopyError?: (error: Error) => void;
} & Pick<CopyStateIconProps, "idleIcon" | "doneIcon" | "errorIcon">;

export function CopyButton({
  size = "icon",
  children,
  text,
  idleIcon,
  doneIcon,
  errorIcon,
  onClick,
  onCopySuccess,
  onCopyError,
  ...props
}: CopyButtonProps) {
  const { state, copy } = useCopyToClipboard({
    onCopyError,
    onCopySuccess,
  });

  return (
    <Button
      size={size}
      onClick={(e) => {
        copy(text);
        onClick?.(e);
      }}
      aria-label="Copy"
      {...props}
    >
      <CopyStateIcon
        state={state}
        idleIcon={idleIcon}
        doneIcon={doneIcon}
        errorIcon={errorIcon}
      />
      {children}
    </Button>
  );
}
