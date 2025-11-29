/**
 * Resizable Layout Renderer Component
 *
 * Renders resizable panel layouts with support for horizontal and vertical orientations.
 */

import { Fragment, type ReactElement } from 'react';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';

import type { ResizableLayoutRendererProps } from './types';
import { generateKey } from './utils';
import { NodeRenderer } from './node-renderer';

/**
 * Renders resizable layout panel
 */
export function ResizableLayoutRenderer({
  node,
  depth,
  onError,
}: ResizableLayoutRendererProps): ReactElement {
  if (!node.panels || node.panels.length === 0) {
    return (
      <div className="p-4 border border-muted rounded-lg bg-muted/20">
        <p className="text-muted-foreground text-sm italic">
          No panels to display
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-border/50 overflow-hidden h-[500px] bg-muted/20 shadow-sm"
      role="region"
      aria-label="Resizable panel layout"
    >
      <ResizablePanelGroup
        direction={node.direction}
        className="h-full w-full"
      >
        {node.panels.map((panel, index) => (
          <Fragment key={generateKey('panel', index)}>
            {index > 0 && (
              <ResizableHandle
                withHandle
                className="bg-border/50 hover:bg-primary/50 transition-colors w-1"
                aria-label="Resize handle"
              />
            )}
            <ResizablePanel
              defaultSize={panel.defaultSize ?? undefined}
              minSize={panel.minSize ?? undefined}
              className="bg-card/30"
            >
              <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
                {panel.children && panel.children.length > 0 ? (
                  panel.children.map((child, childIndex) => (
                    <Fragment key={generateKey('panel-child', childIndex)}>
                      <NodeRenderer node={child} depth={depth} onError={onError} />
                    </Fragment>
                  ))
                ) : (
                  <p className="text-muted-foreground text-sm italic">
                    No content in this panel
                  </p>
                )}
              </div>
            </ResizablePanel>
          </Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  );
}
