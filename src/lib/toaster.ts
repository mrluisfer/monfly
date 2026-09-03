import { type ComponentProps, createElement, useEffect } from "react";
import type { SileoOptions, SileoPosition } from "sileo";
import { Toaster as BaseSileoToaster, sileo as baseSileo } from "sileo";

export type { SileoOptions, SileoPosition } from "sileo";

interface SileoPromiseOptions<T = unknown> {
  action?: SileoOptions | ((data: T) => SileoOptions);
  error: SileoOptions | ((err: unknown) => SileoOptions);
  loading: SileoOptions;
  position?: SileoPosition;
  success: SileoOptions | ((data: T) => SileoOptions);
}

type ToastInput = string | SileoOptions;

const normalizeOptions = (input: ToastInput): SileoOptions =>
  typeof input === "string" ? { title: input } : input;

let isToasterReady = false;
const pendingCalls: Array<() => void> = [];

const runWhenReady = <T>(fn: () => T, fallback: T): T => {
  if (isToasterReady) {
    return fn();
  }
  pendingCalls.push(() => {
    fn();
  });
  return fallback;
};

const flushPendingCalls = () => {
  if (!pendingCalls.length) {
    return;
  }
  const calls = [...pendingCalls];
  pendingCalls.length = 0;
  for (const call of calls) {
    call();
  }
};

const ensureSileoBrowserApis = () => {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.requestAnimationFrame !== "function") {
    window.requestAnimationFrame = (cb: FrameRequestCallback) =>
      window.setTimeout(() => cb(Date.now()), 16);
  }

  if (typeof window.cancelAnimationFrame !== "function") {
    window.cancelAnimationFrame = (id: number) => {
      window.clearTimeout(id);
    };
  }

  if (typeof window.ResizeObserver === "undefined") {
    // A shim for environments without ResizeObserver: the toaster only needs
    // the methods to exist, never to report anything.
    class ResizeObserverFallback {
      observe() {
        // no-op
      }
      unobserve() {
        // no-op
      }
      disconnect() {
        // no-op
      }
    }

    window.ResizeObserver =
      ResizeObserverFallback as unknown as typeof ResizeObserver;
  }
};

export function SileoToaster(props: ComponentProps<typeof BaseSileoToaster>) {
  useEffect(() => {
    ensureSileoBrowserApis();
    isToasterReady = true;
    flushPendingCalls();
    return () => {
      isToasterReady = false;
    };
  }, []);

  return createElement(BaseSileoToaster, props);
}

const success = (input: ToastInput) =>
  runWhenReady(() => baseSileo.success(normalizeOptions(input)), "");
const error = (input: ToastInput) =>
  runWhenReady(() => baseSileo.error(normalizeOptions(input)), "");
const warning = (input: ToastInput) =>
  runWhenReady(() => baseSileo.warning(normalizeOptions(input)), "");
const info = (input: ToastInput) =>
  runWhenReady(() => baseSileo.info(normalizeOptions(input)), "");
const show = (input: ToastInput) =>
  runWhenReady(() => baseSileo.show(normalizeOptions(input)), "");
const action = (options: SileoOptions) =>
  runWhenReady(() => baseSileo.action(options), "");
const promise = <T>(
  promiseInput: Promise<T> | (() => Promise<T>),
  options: SileoPromiseOptions<T>,
) => {
  if (isToasterReady) {
    return baseSileo.promise(promiseInput, options);
  }

  const promiseValue =
    typeof promiseInput === "function" ? promiseInput() : promiseInput;

  pendingCalls.push(() => {
    baseSileo.promise(() => promiseValue, options);
  });

  return promiseValue;
};
const dismiss = (id: string) => {
  runWhenReady(() => {
    baseSileo.dismiss(id);
  }, undefined);
};
const clear = (position?: SileoPosition) => {
  runWhenReady(() => {
    baseSileo.clear(position);
  }, undefined);
};

// Useful semantic helpers for consistent user feedback across the app.
const feedback = {
  copied: (label = "Copied to clipboard") => info({ title: label }),
  created: (entity = "Item") =>
    success({ title: `${entity} created successfully` }),
  deleted: (entity = "Item") =>
    success({ title: `${entity} deleted successfully` }),
  networkError: (
    description = "Check your connection and try again in a moment.",
  ) =>
    error({
      description,
      title: "Network error",
    }),
  updated: (entity = "Item") =>
    success({ title: `${entity} updated successfully` }),
  validationError: (
    description = "Please review the form fields and try again.",
  ) =>
    warning({
      description,
      title: "Validation error",
    }),
};

export const sileo = {
  action,
  clear,
  dismiss,
  error,
  feedback,
  info,
  promise,
  show,
  success,
  warning,
};

export type { SileoPromiseOptions };
