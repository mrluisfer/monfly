import { createElement, useEffect, type ComponentProps } from "react";
import {
  sileo as baseSileo,
  Toaster as BaseSileoToaster,
  type SileoOptions,
  type SileoPosition,
} from "sileo";

type SileoPromiseOptions<T = unknown> = {
  loading: SileoOptions;
  success: SileoOptions | ((data: T) => SileoOptions);
  error: SileoOptions | ((err: unknown) => SileoOptions);
  action?: SileoOptions | ((data: T) => SileoOptions);
  position?: SileoPosition;
};

type ToastInput = string | SileoOptions;

const normalizeOptions = (input: ToastInput): SileoOptions =>
  typeof input === "string" ? { title: input } : input;

let isToasterReady = false;
const pendingCalls: Array<() => void> = [];

const runWhenReady = <T>(fn: () => T, fallback: T): T => {
  if (isToasterReady) return fn();
  pendingCalls.push(() => {
    fn();
  });
  return fallback;
};

const flushPendingCalls = () => {
  if (!pendingCalls.length) return;
  const calls = [...pendingCalls];
  pendingCalls.length = 0;
  calls.forEach((call) => call());
};

const ensureSileoBrowserApis = () => {
  if (typeof window === "undefined") return;

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
    class ResizeObserverFallback {
      observe() {}
      unobserve() {}
      disconnect() {}
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
  options: SileoPromiseOptions<T>
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
    return undefined;
  }, undefined);
};
const clear = (position?: SileoPosition) => {
  runWhenReady(() => {
    baseSileo.clear(position);
    return undefined;
  }, undefined);
};

// Useful semantic helpers for consistent user feedback across the app.
const feedback = {
  created: (entity = "Item") =>
    success({ title: `${entity} created successfully` }),
  updated: (entity = "Item") =>
    success({ title: `${entity} updated successfully` }),
  deleted: (entity = "Item") =>
    success({ title: `${entity} deleted successfully` }),
  copied: (label = "Copied to clipboard") => info({ title: label }),
  validationError: (
    description = "Please review the form fields and try again."
  ) =>
    warning({
      title: "Validation error",
      description,
    }),
  networkError: (
    description = "Check your connection and try again in a moment."
  ) =>
    error({
      title: "Network error",
      description,
    }),
};

export const sileo = {
  show,
  success,
  error,
  warning,
  info,
  action,
  promise,
  dismiss,
  clear,
  feedback,
};

export type { SileoOptions, SileoPosition, SileoPromiseOptions };
