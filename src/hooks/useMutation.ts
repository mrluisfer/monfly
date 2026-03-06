import * as React from "react";
import {
  defaultMutationHaptics,
  type AppHapticPreset,
} from "~/constants/haptics";
import { useAppHaptics } from "~/hooks/useAppHaptics";

type MutationHapticsConfig = {
  enabled?: boolean;
  onMutate?: AppHapticPreset | null;
  onSuccess?: AppHapticPreset | null;
  onError?: AppHapticPreset | null;
};

function isErrorPayload(data: unknown) {
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
}) {
  const [submittedAt, setSubmittedAt] = React.useState<number | undefined>();
  const [variables, setVariables] = React.useState<TVariables | undefined>();
  const [error, setError] = React.useState<TError | undefined>();
  const [data, setData] = React.useState<TData | undefined>();
  const [status, setStatus] = React.useState<
    "idle" | "pending" | "success" | "error"
  >("idle");
  const inFlightRef = React.useRef<Promise<TData | undefined> | null>(null);
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

  const mutate = React.useCallback(
    async (variables: TVariables): Promise<TData | undefined> => {
      if (!opts.allowConcurrent && inFlightRef.current) {
        return inFlightRef.current;
      }

      const mutationPromise = (async () => {
        setStatus("pending");
        setSubmittedAt(Date.now());
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
          } else if (resolvedHaptics?.onSuccess) {
            void triggerPreset(resolvedHaptics.onSuccess);
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
        }
      })();

      inFlightRef.current = mutationPromise;
      return mutationPromise;
    },
    [
      opts.allowConcurrent,
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
