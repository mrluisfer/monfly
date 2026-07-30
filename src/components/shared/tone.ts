/**
 * Single tone scale shared by every metric tile, bar and ring in the app.
 * Each entry maps to a semantic CSS token defined for light *and* dark in
 * globals.css, so no consumer needs its own `dark:` colour pair.
 */
export type Tone =
  | "primary"
  | "destructive"
  | "success"
  | "warning"
  | "info"
  | "neutral";

/** Text colour per tone. */
export const TONE_TEXT: Record<Tone, string> = {
  primary: "text-primary",
  destructive: "text-destructive",
  success: "text-success",
  warning: "text-warning",
  info: "text-info",
  neutral: "text-muted-foreground",
};

/** Fill colour per tone, for bars and progress tracks. */
export const TONE_FILL: Record<Tone, string> = {
  primary: "bg-primary",
  destructive: "bg-destructive",
  success: "bg-success",
  warning: "bg-warning",
  info: "bg-info",
  neutral: "bg-muted-foreground",
};

/** Stroke colour per tone, for SVG rings and lines. */
export const TONE_STROKE: Record<Tone, string> = {
  primary: "stroke-primary",
  destructive: "stroke-destructive",
  success: "stroke-success",
  warning: "stroke-warning",
  info: "stroke-info",
  neutral: "stroke-muted-foreground",
};
