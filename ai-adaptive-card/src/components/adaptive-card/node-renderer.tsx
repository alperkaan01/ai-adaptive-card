/**
 * Node Renderer Component
 *
 * Main dispatcher for rendering different node types.
 */

import type { ReactNode } from 'react';

import type { NodeRendererProps } from './types';
import { handleError, generateKey } from './utils';
import { ChartRenderer } from './chart-renderer';
import { TableRenderer } from './table-renderer';
import { ResizableLayoutRenderer } from './resizable-layout-renderer';

/**
 * Renders bullet list
 */
function BulletListRenderer({ items }: { items: string[] }): ReactNode {
  if (!items || items.length === 0) {
    return (
      <p className="text-muted-foreground text-sm italic">
        No items to display
      </p>
    );
  }

  return (
    <ul
      className="list-disc space-y-3 pl-5 text-base leading-relaxed text-foreground/90 marker:text-primary/50 font-light"
      role="list"
    >
      {items.map((item, index) => (
        <li key={generateKey('bullet', index)}>{item}</li>
      ))}
    </ul>
  );
}

/**
 * Main node rendering dispatcher
 *
 * Routes different node types to their respective renderer components
 * or renders simple text-based nodes directly.
 */
export function NodeRenderer({ node, depth, onError }: NodeRendererProps): ReactNode {
  try {
    switch (node.kind) {
      case 'title':
        return (
          <h3 className="font-serif text-2xl font-medium tracking-tight text-foreground mt-8 first:mt-0 mb-4">
            {node.text || 'Untitled'}
          </h3>
        );

      case 'subtitle':
        return (
          <p className="text-base text-muted-foreground font-light mb-4">
            {node.text}
          </p>
        );

      case 'text':
        return (
          <p className="text-base leading-8 text-foreground/90 font-light">
            {node.text}
          </p>
        );

      case 'bullets':
        return <BulletListRenderer items={node.items} />;

      case 'table':
        return <TableRenderer node={node} onError={onError} />;

      case 'chart':
        return <ChartRenderer node={node} onError={onError} />;

      case 'resizableLayout':
        return <ResizableLayoutRenderer node={node} depth={depth} onError={onError} />;

      case 'card':
        // Import AdaptiveCard dynamically to avoid circular dependency
        // This will be handled by the main AdaptiveCard component
        return null;

      default:
        return null;
    }
  } catch (error) {
    const err = error instanceof Error ? error : new Error('Unknown render error');
    handleError(err, onError);
    return (
      <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
        <p className="text-destructive text-sm" role="alert">
          Error rendering content: {err.message}
        </p>
      </div>
    );
  }
}
