/**
 * Chart Renderer Component
 *
 * Renders charts (bar and line) with validation and memoization for performance.
 */

import { memo, type ReactElement } from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';

import type { ChartRendererProps, ChartData } from './types';
import { DEFAULT_CHART_COLORS, CHART_HEIGHT, MAX_BAR_SIZE } from './constants';
import { isValidChart, handleError } from './utils';

/**
 * Chart component with memoization for performance optimization
 */
export const ChartRenderer = memo(function ChartRenderer({
  node,
  onError,
}: ChartRendererProps): ReactElement {
  // Validate chart data
  if (!isValidChart(node)) {
    const error = new Error('Invalid chart structure: categories and series mismatch');
    handleError(error, onError);
    return (
      <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
        <p className="text-destructive text-sm" role="alert">
          Error: Invalid chart data
        </p>
      </div>
    );
  }

  // Transform data for recharts
  const data: ChartData[] = node.categories.map((category, index) => {
    const entry: ChartData = { category };
    for (const series of node.series) {
      entry[series.name] = series.values[index] ?? 0;
    }
    return entry;
  });

  // Build chart configuration
  const config: ChartConfig = {};
  for (const [index, series] of node.series.entries()) {
    config[series.name] = {
      label: series.name,
      color: series.color || DEFAULT_CHART_COLORS[index % DEFAULT_CHART_COLORS.length],
    };
  }

  return (
    <div
      className="rounded-xl border border-border/50 bg-gradient-to-b from-muted/20 to-transparent p-6 shadow-sm"
      role="img"
      aria-label={`${node.chartType} chart with ${node.series.length} data series`}
    >
      <ChartContainer config={config} className={`h-[${CHART_HEIGHT}px] w-full`}>
        {node.chartType === 'line' ? (
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
            accessibilityLayer
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.4}
            />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  indicator="dot"
                  className="bg-card/95 backdrop-blur-md border-border/50 shadow-xl rounded-xl"
                />
              }
            />
            {node.series.map((series) => (
              <Line
                key={series.name}
                type="monotone"
                dataKey={series.name}
                stroke={series.color || `var(--color-${series.name})`}
                strokeWidth={3}
                dot={{
                  r: 4,
                  fill: series.color || `var(--color-${series.name})`,
                  strokeWidth: 2,
                  stroke: 'hsl(var(--card))'
                }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, bottom: 10, left: 0 }}
            accessibilityLayer
          >
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="hsl(var(--border))"
              opacity={0.4}
            />
            <XAxis
              dataKey="category"
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={15}
              tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }}
            />
            <ChartTooltip
              cursor={{ fill: 'hsl(var(--muted)/0.2)' }}
              content={
                <ChartTooltipContent
                  indicator="dashed"
                  className="bg-card/95 backdrop-blur-md border-border/50 shadow-xl rounded-xl"
                />
              }
            />
            {node.series.map((series) => (
              <Bar
                key={series.name}
                dataKey={series.name}
                fill={series.color || `var(--color-${series.name})`}
                radius={[6, 6, 0, 0]}
                maxBarSize={MAX_BAR_SIZE}
              />
            ))}
          </BarChart>
        )}
      </ChartContainer>
    </div>
  );
});
