import { z } from "zod";

export const conditionSchema = z.object({
  field: z.string(),
  operator: z.enum(["equals", "gte", "lte", "contains"]),
  value: z.union([z.string(), z.number(), z.boolean()]),
});

export const completionSchema = z.discriminatedUnion("type", [
  z.object({
    type: z.literal("eventCount"),
    threshold: z.number().int().positive(),
  }),
  z.object({
    type: z.literal("fieldMatch"),
    field: z.string(),
    value: z.union([z.string(), z.number(), z.boolean()]),
  }),
]);

export const questRuleSchema = z.object({
  id: z.string().min(1),
  questId: z.string().min(1),
  description: z.string().min(1),
  conditions: z.array(conditionSchema).min(1),
  completion: completionSchema,
  rewards: z
    .object({
      xp: z.number().int().nonnegative(),
      badgeId: z.string().optional(),
    })
    .optional(),
});

export const questRuleCatalogSchema = z.array(questRuleSchema);

export type QuestRuleInput = z.infer<typeof questRuleSchema>;
