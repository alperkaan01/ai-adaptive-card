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

const PanelSchema = z.object({
  defaultSize: z.number().optional().nullable(),
  minSize: z.number().optional().nullable(),
  children: z.array(NonLayoutNodeSchema),
});

const ResizableLayoutNodeSchema = z.object({
  kind: z.literal("resizableLayout"),
  direction: z.union([z.literal("horizontal"), z.literal("vertical")]),
  panels: z.array(PanelSchema),
});

export const NodeSchema = z.discriminatedUnion("kind", [
  TitleNodeSchema,
  SubtitleNodeSchema,
  TextNodeSchema,
  BulletsNodeSchema,
  TableNodeSchema,
  ChartNodeSchema,
  ResizableLayoutNodeSchema,
]);

export const CardNodeSchema = z.object({
  kind: z.literal("card"),
  children: z.array(NodeSchema),
});

export type TitleNode = z.infer<typeof TitleNodeSchema>;
export type SubtitleNode = z.infer<typeof SubtitleNodeSchema>;
export type TextNode = z.infer<typeof TextNodeSchema>;
export type BulletsNode = z.infer<typeof BulletsNodeSchema>;
export type TableNode = z.infer<typeof TableNodeSchema>;
export type ChartSeries = z.infer<typeof ChartSeriesSchema>;
export type ChartNode = z.infer<typeof ChartNodeSchema>;
export type Panel = z.infer<typeof PanelSchema>;
export type ResizableLayoutNode = z.infer<typeof ResizableLayoutNodeSchema>;
export type Node = z.infer<typeof NodeSchema>;
export type CardNode = z.infer<typeof CardNodeSchema>;

