/**
 * Utility functions for AdaptiveCard component
 */

import type { TableNode, ChartNode } from '@/lib/card-schema';

/**
 * Safely handles errors with optional callback
 */
export function handleError(error: Error, onError?: (error: Error) => void): void {
  if (onError) {
    onError(error);
  } else {
    console.error('[AdaptiveCard Error]:', error);
  }
}

/**
 * Validates table data structure
 */
export function isValidTable(node: TableNode): boolean {
  if (!node.columns || node.columns.length === 0) return false;
  if (!node.rows || node.rows.length === 0) return false;

  const columnCount = node.columns.length;
  return node.rows.every(row => row && row.length === columnCount);
}

/**
 * Validates chart data structure
 */
export function isValidChart(node: ChartNode): boolean {
  if (!node.categories || node.categories.length === 0) return false;
  if (!node.series || node.series.length === 0) return false;

  const categoryCount = node.categories.length;
  return node.series.every(
    series => series.values && series.values.length === categoryCount
  );
}

/**
 * Generates unique keys for array items
 */
export function generateKey(prefix: string, index: number): string {
  return `${prefix}-${index}`;
}
