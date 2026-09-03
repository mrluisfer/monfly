import { type RefObject, useCallback, useMemo, useRef, useState } from "react";
import { type SileoOptions, sileo } from "~/lib/toaster";

type ToastInput = string | SileoOptions;

type MutationFeedbackResolver<TVariables, TData> =
  | ToastInput
  | ((ctx: { data?: TData; variables: TVariables }) => ToastInput);

interface MutationIdempotencyConfig<TVariables, TData> {
  enabled?: boolean;
  getKey?: (variables: TVariables) => string;
  onBlockedConcurrent?: MutationFeedbackResolver<TVariables, TData>;
  onDuplicatePending?: MutationFeedbackResolver<TVariables, TData>;
  onDuplicateRecentSuccess?: MutationFeedbackResolver<TVariables, TData>;
  windowMs?: number;
}

interface RecentSuccessfulMutation<TData> {
  data?: TData;
  expiresAt: number;
}

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
  allowConcurrent?: boolean;
  idempotency?: MutationIdempotencyConfig<TVariables, TData>;
}) {
  const [submittedAt, setSubmittedAt] = useState<number | undefined>();
  const [variables, setVariables] = useState<TVariables | undefined>();
  const [error, setError] = useState<TError | undefined>();
  const [data, setData] = useState<TData | undefined>();
  const [status, setStatus] = useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const inFlightRef: RefObject<Promise<TData | undefined> | null> =
    useRef(null);
  const inFlightKeyRef: RefObject<string | null> = useRef(null);
  const recentSuccessRef = useRef<Map<string, RecentSuccessfulMutation<TData>>>(
    new Map(),
  );
  // Pulled apart before the memo on purpose: callers pass `idempotency` as an
  // inline object literal, so depending on it directly would recompute (and
  // destabilize `mutate`) on every render. Reading the fields out here means the
  // memo captures only these values, and its dependency list can match exactly.
  const hasIdempotency = opts.idempotency !== undefined;
  const {
    enabled: idempotencyEnabled,
    getKey: idempotencyGetKey,
    windowMs: idempotencyWindowMs,
    onBlockedConcurrent,
    onDuplicatePending,
    onDuplicateRecentSuccess,
  } = opts.idempotency ?? {};

  const resolvedIdempotency = useMemo(() => {
    if (!hasIdempotency || idempotencyEnabled === false) {
      return null;
    }

    return {
      getKey:
        idempotencyGetKey ?? ((input: TVariables) => stableSerialize(input)),
      onBlockedConcurrent:
        onBlockedConcurrent ?? "Please wait for the current action to finish.",
      onDuplicatePending:
        onDuplicatePending ?? "This action is already in progress.",
      onDuplicateRecentSuccess:
        onDuplicateRecentSuccess ??
        "This action was already applied a moment ago.",
      windowMs: idempotencyWindowMs ?? DEFAULT_IDEMPOTENCY_WINDOW_MS,
    };
  }, [
    hasIdempotency,
    idempotencyEnabled,
    idempotencyGetKey,
    idempotencyWindowMs,
    onBlockedConcurrent,
    onDuplicatePending,
    onDuplicateRecentSuccess,
  ]);

  const mutate = useCallback(
    async (input: TVariables): Promise<TData | undefined> => {
      const mutationKey =
        resolvedIdempotency?.getKey(input) ?? stableSerialize(input);
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
                ? feedback({ data: recentSuccess.data, variables: input })
                : feedback,
              "info",
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
                ? feedback({ variables: input })
                : feedback,
              "info",
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
                ? feedback({ variables: input })
                : feedback,
              "warning",
            );
          }

          return;
        }
      }

      const mutationPromise = (async () => {
        setStatus("pending");
        setSubmittedAt(now);
        setVariables(input);

        try {
          const result = await opts.fn(input);
          await opts.onSuccess?.({ data: result });
          setStatus("success");
          setError(undefined);
          setData(result);
          if (!isErrorPayload(result) && mutationKey && resolvedIdempotency) {
            recentSuccessRef.current.set(mutationKey, {
              data: result,
              expiresAt: Date.now() + resolvedIdempotency.windowMs,
            });
          }
          return result;
        } catch (err) {
          setStatus("error");
          setError(err as TError);
        } finally {
          inFlightRef.current = null;
          inFlightKeyRef.current = null;
        }
      })();

      inFlightRef.current = mutationPromise;
      inFlightKeyRef.current = mutationKey;
      return await mutationPromise;
    },
    // Granular deps are intentional to keep `mutate` referentially stable even
    // when callers pass inline option objects.
    [opts.allowConcurrent, resolvedIdempotency, opts.fn, opts.onSuccess],
  );

  return {
    data,
    error,
    mutate,
    status,
    submittedAt,
    variables,
  };
}
