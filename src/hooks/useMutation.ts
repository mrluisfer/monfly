import * as React from "react";
import {
  defaultMutationHaptics,
  type AppHapticPreset,
} from "~/constants/haptics";
import { useAppHaptics } from "~/hooks/useAppHaptics";
import { sileo, type SileoOptions } from "~/lib/toaster";

type MutationHapticsConfig = {
  enabled?: boolean;
  onMutate?: AppHapticPreset | null;
  onSuccess?: AppHapticPreset | null;
  onError?: AppHapticPreset | null;
};

type ToastInput = string | SileoOptions;

type MutationFeedbackResolver<TVariables, TData> =
  | ToastInput
  | ((ctx: { data?: TData; variables: TVariables }) => ToastInput);

type MutationIdempotencyConfig<TVariables, TData> = {
  enabled?: boolean;
  getKey?: (variables: TVariables) => string;
  windowMs?: number;
  onDuplicatePending?: MutationFeedbackResolver<TVariables, TData>;
  onDuplicateRecentSuccess?: MutationFeedbackResolver<TVariables, TData>;
  onBlockedConcurrent?: MutationFeedbackResolver<TVariables, TData>;
};

type RecentSuccessfulMutation<TData> = {
  data?: TData;
  expiresAt: number;
};

const DEFAULT_IDEMPOTENCY_WINDOW_MS = 4000;

function stableSerialize(value: unknown): string {
  if (value === null) {
    return "null";
  }

  if (value instanceof Date) {
    return `date:${value.toISOString()}`;
  }

  if (Array.isArray(value)) {
    return `[${value.map((item) => stableSerialize(item)).join(",")}]`;
  }

  if (typeof value === "object") {
    return `{${Object.entries(value as Record<string, unknown>)
      .sort(([left], [right]) => left.localeCompare(right))
      .map(([key, nestedValue]) => `${key}:${stableSerialize(nestedValue)}`)
      .join(",")}}`;
  }

  return JSON.stringify(value) ?? String(value);
}

function normalizeToastInput(input: ToastInput): SileoOptions {
  return typeof input === "string" ? { title: input } : input;
}

function emitFeedbackToast(input: ToastInput, variant: "info" | "warning") {
  const options = normalizeToastInput(input);

  if (variant === "warning") {
    sileo.warning(options);
    return;
  }

  sileo.info(options);
}

export function isErrorPayload(data: unknown) {
  if (!data || typeof data !== "object") {
    return false;
  }

  if (!("error" in data)) {
    return false;
  }

  return Boolean((data as { error?: unknown }).error);
}

export function useMutation<TVariables, TData, TError = Error>(opts: {
  fn: (variables: TVariables) => Promise<TData>;
  onSuccess?: (ctx: { data: TData }) => void | Promise<void>;
  haptics?: MutationHapticsConfig;
  allowConcurrent?: boolean;
  idempotency?: MutationIdempotencyConfig<TVariables, TData>;
}) {
  const [submittedAt, setSubmittedAt] = React.useState<number | undefined>();
  const [variables, setVariables] = React.useState<TVariables | undefined>();
  const [error, setError] = React.useState<TError | undefined>();
  const [data, setData] = React.useState<TData | undefined>();
  const [status, setStatus] = React.useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const inFlightRef = React.useRef<Promise<TData | undefined> | null>(null);
  const inFlightKeyRef = React.useRef<string | null>(null);
  const recentSuccessRef = React.useRef<Map<string, RecentSuccessfulMutation<TData>>>(
    new Map()
  );
  const { triggerPreset } = useAppHaptics();

  const resolvedHaptics = React.useMemo(() => {
    if (opts.haptics?.enabled === false) {
      return null;
    }

    return {
      onMutate: opts.haptics?.onMutate ?? defaultMutationHaptics.onMutate,
      onSuccess: opts.haptics?.onSuccess ?? defaultMutationHaptics.onSuccess,
      onError: opts.haptics?.onError ?? defaultMutationHaptics.onError,
    };
  }, [
    opts.haptics?.enabled,
    opts.haptics?.onError,
    opts.haptics?.onMutate,
    opts.haptics?.onSuccess,
  ]);

  const resolvedIdempotency = React.useMemo(() => {
    if (!opts.idempotency || opts.idempotency.enabled === false) {
      return null;
    }

    return {
      getKey:
        opts.idempotency?.getKey ??
        ((variables: TVariables) => stableSerialize(variables)),
      windowMs: opts.idempotency?.windowMs ?? DEFAULT_IDEMPOTENCY_WINDOW_MS,
      onBlockedConcurrent:
        opts.idempotency?.onBlockedConcurrent ??
        "Please wait for the current action to finish.",
      onDuplicatePending:
        opts.idempotency?.onDuplicatePending ??
        "This action is already in progress.",
      onDuplicateRecentSuccess:
        opts.idempotency?.onDuplicateRecentSuccess ??
        "This action was already applied a moment ago.",
    };
  }, [
    opts.idempotency?.enabled,
    opts.idempotency?.getKey,
    opts.idempotency?.onBlockedConcurrent,
    opts.idempotency?.onDuplicatePending,
    opts.idempotency?.onDuplicateRecentSuccess,
    opts.idempotency?.windowMs,
  ]);

  const mutate = React.useCallback(
    async (variables: TVariables): Promise<TData | undefined> => {
      const mutationKey =
        resolvedIdempotency?.getKey(variables) ?? stableSerialize(variables);
      const now = Date.now();

      if (resolvedIdempotency?.windowMs) {
        for (const [key, mutation] of recentSuccessRef.current.entries()) {
          if (mutation.expiresAt <= now) {
            recentSuccessRef.current.delete(key);
          }
        }
      }

      if (resolvedIdempotency && mutationKey) {
        const recentSuccess = recentSuccessRef.current.get(mutationKey);
        if (recentSuccess && recentSuccess.expiresAt > now) {
          const feedback = resolvedIdempotency.onDuplicateRecentSuccess;
          if (feedback) {
            emitFeedbackToast(
              typeof feedback === "function"
                ? feedback({ data: recentSuccess.data, variables })
                : feedback,
              "info"
            );
          }

          return recentSuccess.data;
        }
      }

      if (inFlightRef.current) {
        if (mutationKey && mutationKey === inFlightKeyRef.current) {
          const feedback =
            resolvedIdempotency?.onDuplicatePending ??
            "This action is already in progress.";
          if (feedback) {
            emitFeedbackToast(
              typeof feedback === "function"
                ? feedback({ variables })
                : feedback,
              "info"
            );
          }

          return inFlightRef.current;
        }

        if (!opts.allowConcurrent) {
          const feedback =
            resolvedIdempotency?.onBlockedConcurrent ??
            "Please wait for the current action to finish.";
          if (feedback) {
            emitFeedbackToast(
              typeof feedback === "function"
                ? feedback({ variables })
                : feedback,
              "warning"
            );
          }

          return undefined;
        }
      }

      const mutationPromise = (async () => {
        setStatus("pending");
        setSubmittedAt(now);
        setVariables(variables);
        if (resolvedHaptics?.onMutate) {
          void triggerPreset(resolvedHaptics.onMutate);
        }
        //
        try {
          const data = await opts.fn(variables);
          await opts.onSuccess?.({ data });
          setStatus("success");
          setError(undefined);
          setData(data);
          if (isErrorPayload(data)) {
            if (resolvedHaptics?.onError) {
              void triggerPreset(resolvedHaptics.onError);
            }
          } else {
            if (mutationKey && resolvedIdempotency) {
              recentSuccessRef.current.set(mutationKey, {
                data,
                expiresAt: Date.now() + resolvedIdempotency.windowMs,
              });
            }
            if (resolvedHaptics?.onSuccess) {
              void triggerPreset(resolvedHaptics.onSuccess);
            }
          }
          return data;
          // biome-ignore lint/suspicious/noExplicitAny: <explanation>
        } catch (err: any) {
          setStatus("error");
          setError(err);
          if (resolvedHaptics?.onError) {
            void triggerPreset(resolvedHaptics.onError);
          }
        } finally {
          inFlightRef.current = null;
          inFlightKeyRef.current = null;
        }
      })();

      inFlightRef.current = mutationPromise;
      inFlightKeyRef.current = mutationKey ?? null;
      return mutationPromise;
    },
    [
      opts.allowConcurrent,
      resolvedIdempotency,
      opts.fn,
      opts.onSuccess,
      resolvedHaptics,
      triggerPreset,
    ]
  );

  return {
    status,
    variables,
    submittedAt,
    mutate,
    error,
    data,
  };
}
