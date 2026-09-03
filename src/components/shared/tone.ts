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
  destructive: "text-destructive",
  info: "text-info",
  neutral: "text-muted-foreground",
  primary: "text-primary",
  success: "text-success",
  warning: "text-warning",
};

/** Fill colour per tone, for bars and progress tracks. */
export const TONE_FILL: Record<Tone, string> = {
  destructive: "bg-destructive",
  info: "bg-info",
  neutral: "bg-muted-foreground",
  primary: "bg-primary",
  success: "bg-success",
  warning: "bg-warning",
};

/** Stroke colour per tone, for SVG rings and lines. */
export const TONE_STROKE: Record<Tone, string> = {
  destructive: "stroke-destructive",
  info: "stroke-info",
  neutral: "stroke-muted-foreground",
  primary: "stroke-primary",
  success: "stroke-success",
  warning: "stroke-warning",
};
