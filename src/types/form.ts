import type { ControllerProps, FieldValues } from "react-hook-form";

/**
 * What react-hook-form hands a `<FormField render>`.
 *
 * Named so render functions can be hoisted out of the JSX: a render prop is
 * still a JSX prop, and an inline one is a fresh function reference on every
 * keystroke. Hoisted to module scope where it closes over nothing, wrapped in
 * `useCallback` where it doesn't.
 */
export type FieldRenderProps<TFieldValues extends FieldValues> = Parameters<
  ControllerProps<TFieldValues>["render"]
>[0];

/** The `field` bag alone, for controls that only need the binding. */
export type RenderedField<TFieldValues extends FieldValues> =
  FieldRenderProps<TFieldValues>["field"];
