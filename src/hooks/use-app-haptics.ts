import { useCallback } from "react";
import { appHapticPresets, type AppHapticPreset } from "~/constants/haptics";
import type {
  HapticInput,
  TriggerOptions,
  WebHapticsOptions,
} from "web-haptics";
import { useWebHaptics } from "web-haptics/react";

type UseAppHapticsOptions = WebHapticsOptions & {
  enabled?: boolean;
};

export function useAppHaptics(options?: UseAppHapticsOptions) {
  const { enabled = true, ...webHapticsOptions } = options ?? {};
  const resolvedWebHapticsOptions: WebHapticsOptions = {
    ...webHapticsOptions,
    // In development, enable debug audio by default so haptics can be validated on desktop.
    debug:
      webHapticsOptions.debug ??
      (import.meta.env.DEV && import.meta.env.VITE_HAPTICS_DEBUG !== "false"),
    showSwitch:
      webHapticsOptions.showSwitch ??
      import.meta.env.VITE_HAPTICS_SWITCH === "true",
  };
  const {
    trigger: triggerRaw,
    cancel,
    isSupported,
  } = useWebHaptics(resolvedWebHapticsOptions);

  const trigger = useCallback(
    (input?: HapticInput, triggerOptions?: TriggerOptions) => {
      if (!enabled) {
        return Promise.resolve();
      }

      return triggerRaw(input, triggerOptions) ?? Promise.resolve();
    },
    [enabled, triggerRaw]
  );

  const triggerPreset = useCallback(
    (preset: AppHapticPreset, triggerOptions?: TriggerOptions) => {
      const presetConfig = appHapticPresets[preset];
      if (!presetConfig) {
        return Promise.resolve();
      }

      return trigger(presetConfig.pattern, {
        ...presetConfig.options,
        ...triggerOptions,
      });
    },
    [trigger]
  );

  return {
    trigger,
    triggerPreset,
    cancel,
    isSupported,
    success: (triggerOptions?: TriggerOptions) =>
      triggerPreset("success", triggerOptions),
    warning: (triggerOptions?: TriggerOptions) =>
      triggerPreset("warning", triggerOptions),
    selection: (triggerOptions?: TriggerOptions) =>
      triggerPreset("selection", triggerOptions),
    soft: (triggerOptions?: TriggerOptions) =>
      triggerPreset("soft", triggerOptions),
    error: (triggerOptions?: TriggerOptions) =>
      triggerPreset("error", triggerOptions),
  };
}
