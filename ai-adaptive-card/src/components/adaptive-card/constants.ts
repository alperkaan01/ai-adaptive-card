/**
 * Constants for AdaptiveCard component configuration
 */

/** Maximum nesting depth to prevent infinite recursion */
export const MAX_DEPTH = 10;

/** Default chart colors using CSS variables */
export const DEFAULT_CHART_COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
] as const;

/** Chart height in pixels */
export const CHART_HEIGHT = 350;

/** Maximum bar width in charts */
export const MAX_BAR_SIZE = 60;
