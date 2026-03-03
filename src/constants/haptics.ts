import type { HapticPattern, TriggerOptions } from "web-haptics";

export type AppHapticPreset =
  | "success"
  | "warning"
  | "selection"
  | "soft"
  | "error";

type AppHapticPresetConfig = {
  description: string;
  pattern: HapticPattern;
  options?: TriggerOptions;
};

export const appHapticPresets: Record<AppHapticPreset, AppHapticPresetConfig> =
  {
    success: {
      description: "Confirms a successful action.",
      pattern: [{ duration: 30 }, { delay: 60, duration: 40, intensity: 1 }],
    },
    warning: {
      description: "Warns about recoverable issues or invalid states.",
      pattern: [
        { duration: 40, intensity: 0.8 },
        { delay: 100, duration: 40, intensity: 0.6 },
      ],
    },
    selection: {
      description: "Light feedback for taps, selections, and navigation.",
      pattern: [{ duration: 8 }],
      options: { intensity: 0.3 },
    },
    soft: {
      description: "Gentle confirmation for non-critical actions.",
      pattern: [{ duration: 40 }],
    },
    error: {
      description: "Clear feedback for failed critical actions.",
      pattern: [
        { duration: 40, intensity: 0.9 },
        { delay: 40, duration: 40, intensity: 0.9 },
        { delay: 40, duration: 40, intensity: 0.9 },
      ],
    },
  };

export const defaultMutationHaptics = {
  onMutate: "soft",
  onSuccess: "success",
  onError: "error",
} as const;
