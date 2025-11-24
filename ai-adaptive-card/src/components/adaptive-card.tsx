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

type AdaptiveCardProps = {
  card: CardNode;
};

/**
 * Renders a validated `CardNode` as a single adaptive card.
 *
 * @param {AdaptiveCardProps} props - The card to render
 * @returns {ReactElement} The rendered adaptive card
 */
function AdaptiveCard({ card }: AdaptiveCardProps): ReactElement {
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
    <Card className="w-full shadow-lg transition-all duration-500 animate-in fade-in zoom-in-95">
      {headerNodes.length > 0 && (
        <CardHeader className="border-b pb-6">
          {headerNodes.map((node, index) => {
            if (node.kind === 'title') {
              return (
                <CardTitle key={index} className="text-2xl font-bold tracking-tight md:text-3xl">
                  {node.text}
                </CardTitle>
              );
            }
            if (node.kind === 'subtitle') {
              return (
                <CardDescription key={index} className="text-base mt-2">{node.text}</CardDescription>
              );
            }
            return null;
          })}
        </CardHeader>
      )}
      <CardContent className="flex flex-col gap-8 py-8">
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
        <h2 className="text-lg font-semibold leading-tight">{node.text}</h2>
      );
    case 'subtitle':
      return <p className="text-sm text-muted-foreground">{node.text}</p>;
    case 'text':
      return <p className="text-sm leading-relaxed">{node.text}</p>;
    case 'bullets':
      return (
        <ul className="list-disc space-y-1 pl-5 text-sm leading-relaxed">
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
      return <AdaptiveCard card={node} />;
    default:
      return null;
  }
}

function renderTable(node: TableNode): ReactElement {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          {node.columns.map((column, index) => (
            <TableHead key={index}>{column}</TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {node.rows.map((row, rowIndex) => (
          <TableRow key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <TableCell key={cellIndex}>{cell}</TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
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
    <ChartContainer config={config} className="h-64 w-full">
      {node.chartType === 'line' ? (
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="category" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          {node.series.map((series) => (
            <Line
              key={series.name}
              type="monotone"
              dataKey={series.name}
              stroke={series.color || `var(--color-${series.name})`}
              strokeWidth={3}
              dot={false}
            />
          ))}
        </LineChart>
      ) : (
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="category" />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          {node.series.map((series) => (
            <Bar
              key={series.name}
              dataKey={series.name}
              fill={series.color || `var(--color-${series.name})`}
              radius={6}
              maxBarSize={48}
            />
          ))}
        </BarChart>
      )}
    </ChartContainer>
  );
}

function renderResizableLayout(node: ResizableLayoutNode): ReactElement {
  return (
    <ResizablePanelGroup direction={node.direction}>
      {node.panels.map((panel, index) => (
        <Fragment key={index}>
          {index > 0 && <ResizableHandle withHandle />}
          <ResizablePanel
            defaultSize={panel.defaultSize ?? undefined}
            minSize={panel.minSize ?? undefined}
          >
            <div className="flex h-full flex-col gap-4 p-6">
              {panel.children.map((child, childIndex) => (
                <Fragment key={childIndex}>{renderNode(child)}</Fragment>
              ))}
            </div>
          </ResizablePanel>
        </Fragment>
      ))}
    </ResizablePanelGroup>
  );
}

export default AdaptiveCard;
