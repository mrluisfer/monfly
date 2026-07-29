/**
 * Window of the daily-activity heatmap, GitHub-contribution-graph style.
 *
 * Shared by the DB query and the chart so the two can't drift: they were out of
 * sync before (the query fetched 13 weeks while the grid drew 52), which left
 * three quarters of the graph blank no matter how much history existed.
 */
export const DAILY_ACTIVITY_WEEKS = 52;

/** Days fetched/rendered, inclusive of today. */
export const DAILY_ACTIVITY_DAYS = DAILY_ACTIVITY_WEEKS * 7;
