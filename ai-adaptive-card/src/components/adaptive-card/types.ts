/**
 * Type definitions for AdaptiveCard component
 */

import type { CardNode, ChartNode, TableNode, ResizableLayoutNode, Node } from '@/lib/card-schema';

/**
 * Props for the AdaptiveCard component
 */
export interface AdaptiveCardProps {
  /** The card data structure to render */
  card: CardNode;
  /** Optional CSS class names for custom styling */
  className?: string;
  /** Optional error handler callback */
  onError?: (error: Error) => void;
  /** Whether to show the "Generated" badge in header */
  showBadge?: boolean;
  /** Custom badge text (defaults to "Generated") */
  badgeText?: string;
  /** Depth level for nested cards (used internally) */
  depth?: number;
}

/**
 * Configuration for chart rendering
 */
export interface ChartData {
  category: string;
  [key: string]: string | number;
}

/**
 * Props for chart renderer component
 */
export interface ChartRendererProps {
  node: ChartNode;
  onError?: (error: Error) => void;
}

/**
 * Props for table renderer component
 */
export interface TableRendererProps {
  node: TableNode;
  onError?: (error: Error) => void;
}

/**
 * Props for resizable layout renderer component
 */
export interface ResizableLayoutRendererProps {
  node: ResizableLayoutNode;
  depth: number;
  onError?: (error: Error) => void;
}

/**
 * Props for node renderer component
 */
export interface NodeRendererProps {
  node: Node;
  depth: number;
  onError?: (error: Error) => void;
}
