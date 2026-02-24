import {
  sileo as baseSileo,
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

const success = (input: ToastInput) =>
  baseSileo.success(normalizeOptions(input));
const error = (input: ToastInput) => baseSileo.error(normalizeOptions(input));
const warning = (input: ToastInput) =>
  baseSileo.warning(normalizeOptions(input));
const info = (input: ToastInput) => baseSileo.info(normalizeOptions(input));
const show = (input: ToastInput) => baseSileo.show(normalizeOptions(input));
const action = (options: SileoOptions) => baseSileo.action(options);
const promise = <T>(
  promiseInput: Promise<T> | (() => Promise<T>),
  options: SileoPromiseOptions<T>
) => baseSileo.promise(promiseInput, options);
const dismiss = (id: string) => baseSileo.dismiss(id);
const clear = (position?: SileoPosition) => baseSileo.clear(position);

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
