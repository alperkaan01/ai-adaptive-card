import { z } from "zod";

const TitleNodeSchema = z.object({
  kind: z.literal("title"),
  text: z.string(),
});

const SubtitleNodeSchema = z.object({
  kind: z.literal("subtitle"),
  text: z.string(),
});

const TextNodeSchema = z.object({
  kind: z.literal("text"),
  text: z.string(),
});

const BulletsNodeSchema = z.object({
  kind: z.literal("bullets"),
  items: z.array(z.string()),
});

const TableNodeSchema = z.object({
  kind: z.literal("table"),
  columns: z.array(z.string()),
  rows: z.array(z.array(z.string())),
});

const ChartSeriesSchema = z.object({
  name: z.string(),
  values: z.array(z.number()),
  color: z.string().optional(),
});

const ChartNodeSchema = z
  .object({
    kind: z.literal("chart"),
    chartType: z.union([z.literal("bar"), z.literal("line")]),
    categories: z.array(z.string()),
    series: z.array(ChartSeriesSchema),
  })
  .superRefine((data, ctx) => {
    const categoryCount = data.categories.length;
    if (categoryCount === 0 && data.series.length > 0) {
      ctx.addIssue({
        code: "custom",
        message:
          "categories must not be empty when series are provided",
      });
    }
    for (const s of data.series) {
      if (s.values.length !== categoryCount) {
        ctx.addIssue({
          code: "custom",
          message:
            "every series.values array must have the same length as categories",
        });
        break;
      }
    }
  });

const NonLayoutNodeSchema = z.union([
  TitleNodeSchema,
  SubtitleNodeSchema,
  TextNodeSchema,
  BulletsNodeSchema,
  TableNodeSchema,
  ChartNodeSchema,
]);

// Panel children may include non-layout nodes plus nested cards,
// but never resizableLayout.
const PanelChildSchema: z.ZodTypeAny = z.lazy(() =>
  z.union([NonLayoutNodeSchema, CardNodeSchema]),
);

const PanelSchema = z.object({
  defaultSize: z.number().optional().nullable(),
  minSize: z.number().optional().nullable(),
  children: z.array(PanelChildSchema),
});

const ResizableLayoutNodeSchema = z.object({
  kind: z.literal("resizableLayout"),
  direction: z.union([z.literal("horizontal"), z.literal("vertical")]),
  panels: z.array(PanelSchema),
});

export const CardNodeSchema: z.ZodTypeAny = z.lazy(() =>
  z.object({
    kind: z.literal("card"),
    children: z.array(NodeSchema),
  }),
);

export const NodeSchema = z.lazy(() =>
  z.union([
    z.discriminatedUnion("kind", [
      TitleNodeSchema,
      SubtitleNodeSchema,
      TextNodeSchema,
      BulletsNodeSchema,
      TableNodeSchema,
      ChartNodeSchema,
      ResizableLayoutNodeSchema,
    ]),
    CardNodeSchema,
  ]),
);

export type ChartSeries = {
  name: string;
  values: number[];
  color?: string;
};

export type TitleNode = {
  kind: "title";
  text: string;
};

export type SubtitleNode = {
  kind: "subtitle";
  text: string;
};

export type TextNode = {
  kind: "text";
  text: string;
};

export type BulletsNode = {
  kind: "bullets";
  items: string[];
};

export type TableNode = {
  kind: "table";
  columns: string[];
  rows: string[][];
};

export type ChartNode = {
  kind: "chart";
  chartType: "bar" | "line";
  categories: string[];
  series: ChartSeries[];
};

export type NonLayoutNode =
  | TitleNode
  | SubtitleNode
  | TextNode
  | BulletsNode
  | TableNode
  | ChartNode;

export type PanelChildNode = NonLayoutNode | CardNode;

export type Panel = {
  defaultSize?: number | null;
  minSize?: number | null;
  children: PanelChildNode[];
};

export type ResizableLayoutNode = {
  kind: "resizableLayout";
  direction: "horizontal" | "vertical";
  panels: Panel[];
};

export type Node = NonLayoutNode | ResizableLayoutNode | CardNode;

export type CardNode = {
  kind: "card";
  children: Node[];
};
