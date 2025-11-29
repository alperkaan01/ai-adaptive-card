/**
 * AdaptiveCard Component
 *
 * A professional, production-ready adaptive card renderer that transforms
 * JSON card schemas into beautiful, interactive UI components.
 *
 * Features:
 * - Type-safe rendering with full TypeScript support
 * - Comprehensive error handling and fallbacks
 * - WCAG 2.1 AA accessibility compliant
 * - Fully responsive design
 * - Performance optimized with memoization
 * - Highly customizable styling
 * - Support for nested cards and complex layouts
 *
 * @example
 * ```tsx
 * <AdaptiveCard
 *   card={cardData}
 *   className="custom-styles"
 *   onError={(error) => console.error(error)}
 * />
 * ```
 */

'use client';

import { Fragment, memo, useMemo, type ReactElement, type ReactNode } from 'react';

import type { Node } from '@/lib/card-schema';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import type { AdaptiveCardProps } from './types';
import { MAX_DEPTH } from './constants';
import { handleError, generateKey } from './utils';
import { NodeRenderer } from './node-renderer';

/**
 * Renders header nodes (title/subtitle)
 */
function renderHeaderNode(node: Node): ReactNode {
  if (node.kind === 'title') {
    return (
      <h1 className="font-serif text-4xl font-medium tracking-tight text-foreground drop-shadow-sm">
        {node.text || 'Untitled'}
      </h1>
    );
  }
  if (node.kind === 'subtitle') {
    return (
      <p className="text-lg text-muted-foreground font-light leading-relaxed">
        {node.text}
      </p>
    );
  }
  return null;
}

/**
 * AdaptiveCard - Main component for rendering adaptive card structures
 *
 * Renders a validated CardNode as a beautiful, interactive UI component
 * with full support for nested structures, charts, tables, and layouts.
 *
 * @param {AdaptiveCardProps} props - Component properties
 * @returns {ReactElement} The rendered adaptive card
 */
function AdaptiveCard({
  card,
  className = '',
  onError,
  showBadge = true,
  badgeText = 'Generated',
  depth = 0,
}: AdaptiveCardProps): ReactElement {
  // Prevent infinite recursion
  if (depth > MAX_DEPTH) {
    const error = new Error(`Maximum nesting depth (${MAX_DEPTH}) exceeded`);
    handleError(error, onError);
    return (
      <Card className="w-full p-6 border-destructive">
        <p className="text-destructive text-sm" role="alert">
          Error: Maximum nesting depth exceeded
        </p>
      </Card>
    );
  }

  // Validate card structure
  if (!card || card.kind !== 'card' || !Array.isArray(card.children)) {
    const error = new Error('Invalid card structure provided');
    handleError(error, onError);
    return (
      <Card className="w-full p-6 border-destructive">
        <p className="text-destructive text-sm" role="alert">
          Error: Invalid card data
        </p>
      </Card>
    );
  }

  // Separate header and body nodes
  const [headerNodes, bodyNodes] = useMemo<[Node[], Node[]]>(() => {
    const header: Node[] = [];
    const body: Node[] = [];
    let inHeader = true;

    for (const child of card.children) {
      if (inHeader && (child.kind === 'title' || child.kind === 'subtitle')) {
        header.push(child);
      } else {
        inHeader = false;
        body.push(child);
      }
    }

    return [header, body];
  }, [card.children]);

  // Determine if this is a nested card
  const isNested = depth > 0;

  // Base styles for card
  const cardStyles = isNested
    ? 'shadow-sm ring-1 ring-border/50 bg-muted/30'
    : 'w-full overflow-hidden border-none shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-xl transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 ring-1 ring-border/50';

  return (
    <Card
      className={`${cardStyles} ${className}`}
      role="article"
      aria-label="Adaptive card"
    >
      {headerNodes.length > 0 && (
        <header className="px-8 pt-8 pb-6 bg-gradient-to-b from-muted/20 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3 flex-1 min-w-0">
              {headerNodes.map((node, index) => (
                <Fragment key={generateKey('header', index)}>
                  {renderHeaderNode(node)}
                </Fragment>
              ))}
            </div>
            {showBadge && !isNested && (
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono text-[10px] uppercase tracking-widest px-2 py-1 border-primary/20 shrink-0"
                aria-label="Card generation status"
              >
                {badgeText}
              </Badge>
            )}
          </div>
        </header>
      )}
      <CardContent className="p-8 space-y-8">
        {bodyNodes.length > 0 ? (
          bodyNodes.map((node, index) => {
            // Handle nested cards specially
            if (node.kind === 'card') {
              return (
                <Fragment key={generateKey('body', index)}>
                  <AdaptiveCard
                    card={node}
                    depth={depth + 1}
                    onError={onError}
                    showBadge={false}
                  />
                </Fragment>
              );
            }
            // Render other nodes
            return (
              <Fragment key={generateKey('body', index)}>
                <NodeRenderer node={node} depth={depth} onError={onError} />
              </Fragment>
            );
          })
        ) : (
          <p className="text-muted-foreground text-sm italic">
            No content available
          </p>
        )}
      </CardContent>
    </Card>
  );
}

// Export memoized version for performance
export default memo(AdaptiveCard);
