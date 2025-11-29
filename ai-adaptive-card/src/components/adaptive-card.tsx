'use client';

/**
 * AdaptiveCard (Client Component): renders a single adaptive card tree
 * using the constrained schema and ShadCN-based primitives.
 */
import {
  Fragment,
  useMemo,
  type ReactElement,
  type ReactNode,
} from 'react';
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from 'recharts';

import type {
  CardNode,
  ChartNode,
  Node,
  ResizableLayoutNode,
  TableNode,
} from '@/lib/card-schema';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

type AdaptiveCardProps = {
  card: CardNode;
  className?: string;
};

/**
 * Renders a validated `CardNode` as a single adaptive card.
 *
 * @param {AdaptiveCardProps} props - The card to render
 * @returns {ReactElement} The rendered adaptive card
 */
function AdaptiveCard({ card, className }: AdaptiveCardProps): ReactElement {
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

  return (
    <Card className={`w-full overflow-hidden border-none shadow-2xl shadow-black/5 bg-card/80 backdrop-blur-xl transition-all duration-700 animate-in fade-in slide-in-from-bottom-4 zoom-in-95 ring-1 ring-border/50 ${className}`}>
      {headerNodes.length > 0 && (
        <div className="px-8 pt-8 pb-6 bg-gradient-to-b from-muted/20 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-3">
              {headerNodes.map((node, index) => {
                if (node.kind === 'title') {
                  return (
                    <h1 key={index} className="font-serif text-4xl font-medium tracking-tight text-foreground drop-shadow-sm">
                      {node.text}
                    </h1>
                  );
                }
                if (node.kind === 'subtitle') {
                  return (
                    <p key={index} className="text-lg text-muted-foreground font-light leading-relaxed">
                      {node.text}
                    </p>
                  );
                }
                return null;
              })}
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary hover:bg-primary/20 transition-colors font-mono text-[10px] uppercase tracking-widest px-2 py-1 border-primary/20">
              Generated
            </Badge>
          </div>
        </div>
      )}
      <CardContent className="p-8 space-y-8">
        {bodyNodes.map((node, index) => (
          <Fragment key={index}>{renderNode(node)}</Fragment>
        ))}
      </CardContent>
    </Card>
  );
}

function renderNode(node: Node): ReactNode {
  switch (node.kind) {
    case 'title':
      return (
        <h3 className="font-serif text-2xl font-medium tracking-tight text-foreground mt-8 first:mt-0 mb-4">
          {node.text}
        </h3>
      );
    case 'subtitle':
      return <p className="text-base text-muted-foreground font-light mb-4">{node.text}</p>;
    case 'text':
      return <p className="text-base leading-8 text-foreground/90 font-light">{node.text}</p>;
    case 'bullets':
      return (
        <ul className="list-disc space-y-3 pl-5 text-base leading-relaxed text-foreground/90 marker:text-primary/50 font-light">
          {node.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ul>
      );
    case 'table':
      return renderTable(node);
    case 'chart':
      return renderChart(node);
    case 'resizableLayout':
      return renderResizableLayout(node);
    case 'card':
      return <AdaptiveCard card={node} className="shadow-sm ring-1 ring-border/50 bg-muted/30" />;
    default:
      return null;
  }
}

function renderTable(node: TableNode): ReactElement {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden bg-muted/20 shadow-sm">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow className="hover:bg-transparent border-border/50">
            {node.columns.map((column, index) => (
              <TableHead key={index} className="font-medium text-xs uppercase tracking-wider text-muted-foreground py-4">
                {column}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {node.rows.map((row, rowIndex) => (
            <TableRow key={rowIndex} className="hover:bg-muted/50 border-border/50 transition-colors">
              {row.map((cell, cellIndex) => (
                <TableCell key={cellIndex} className="font-light text-sm py-4">
                  {cell}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

function renderChart(node: ChartNode): ReactElement {
  const data = node.categories.map((category, index) => {
    const entry: Record<string, string | number> = { category };
    for (const series of node.series) {
      entry[series.name] = series.values[index] ?? 0;
    }
    return entry;
  });

  const config: ChartConfig = {};
  const defaultColors = [
    'hsl(var(--chart-1))',
    'hsl(var(--chart-2))',
    'hsl(var(--chart-3))',
    'hsl(var(--chart-4))',
    'hsl(var(--chart-5))',
  ];

  for (const [index, series] of node.series.entries()) {
    config[series.name] = {
      label: series.name,
      color: series.color || defaultColors[index % defaultColors.length],
    };
  }

  return (
    <div className="rounded-xl border border-border/50 bg-gradient-to-b from-muted/20 to-transparent p-6 shadow-sm">
      <ChartContainer config={config} className="h-[350px] w-full">
        {node.chartType === 'line' ? (
          <LineChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
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
            <ChartTooltip content={<ChartTooltipContent indicator="dot" className="bg-card/95 backdrop-blur-md border-border/50 shadow-xl rounded-xl" />} />
            {node.series.map((series, index) => (
              <Line
                key={series.name}
                type="monotone"
                dataKey={series.name}
                stroke={series.color || `var(--color-${series.name})`}
                strokeWidth={3}
                dot={{ r: 4, fill: series.color || `var(--color-${series.name})`, strokeWidth: 2, stroke: 'hsl(var(--card))' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
              />
            ))}
          </LineChart>
        ) : (
          <BarChart data={data} margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.4} />
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
            <ChartTooltip cursor={{ fill: 'hsl(var(--muted)/0.2)' }} content={<ChartTooltipContent indicator="dashed" className="bg-card/95 backdrop-blur-md border-border/50 shadow-xl rounded-xl" />} />
            {node.series.map((series) => (
              <Bar
                key={series.name}
                dataKey={series.name}
                fill={series.color || `var(--color-${series.name})`}
                radius={[6, 6, 0, 0]}
                maxBarSize={60}
              />
            ))}
          </BarChart>
        )}
      </ChartContainer>
    </div>
  );
}

function renderResizableLayout(node: ResizableLayoutNode): ReactElement {
  return (
    <div className="rounded-xl border border-border/50 overflow-hidden h-[500px] bg-muted/20 shadow-sm">
      <ResizablePanelGroup direction={node.direction} className="h-full w-full">
        {node.panels.map((panel, index) => (
          <Fragment key={index}>
            {index > 0 && <ResizableHandle withHandle className="bg-border/50 hover:bg-primary/50 transition-colors w-1" />}
            <ResizablePanel
              defaultSize={panel.defaultSize ?? undefined}
              minSize={panel.minSize ?? undefined}
              className="bg-card/30"
            >
              <div className="flex flex-col gap-6 p-6 h-full overflow-auto">
                {panel.children.map((child, childIndex) => (
                  <Fragment key={childIndex}>{renderNode(child)}</Fragment>
                ))}
              </div>
            </ResizablePanel>
          </Fragment>
        ))}
      </ResizablePanelGroup>
    </div>
  );
}

export default AdaptiveCard;
