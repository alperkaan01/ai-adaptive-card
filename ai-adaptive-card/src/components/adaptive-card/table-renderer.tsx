/**
 * Table Renderer Component
 *
 * Renders data tables with validation and responsive design.
 */

import type { ReactElement } from 'react';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import type { TableRendererProps } from './types';
import { isValidTable, handleError, generateKey } from './utils';

/**
 * Renders table with validation
 */
export function TableRenderer({ node, onError }: TableRendererProps): ReactElement {
  if (!isValidTable(node)) {
    const error = new Error('Invalid table structure: columns and rows mismatch');
    handleError(error, onError);
    return (
      <div className="p-4 border border-destructive/50 rounded-lg bg-destructive/5">
        <p className="text-destructive text-sm" role="alert">
          Error: Invalid table data
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-xl border border-border/50 overflow-hidden bg-muted/20 shadow-sm"
      role="region"
      aria-label="Data table"
    >
      <div className="overflow-x-auto">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent border-border/50">
              {node.columns.map((column, index) => (
                <TableHead
                  key={generateKey('col', index)}
                  className="font-medium text-xs uppercase tracking-wider text-muted-foreground py-4 whitespace-nowrap"
                >
                  {column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {node.rows.map((row, rowIndex) => (
              <TableRow
                key={generateKey('row', rowIndex)}
                className="hover:bg-muted/50 border-border/50 transition-colors"
              >
                {row.map((cell, cellIndex) => (
                  <TableCell
                    key={generateKey(`cell-${rowIndex}`, cellIndex)}
                    className="font-light text-sm py-4"
                  >
                    {cell}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
