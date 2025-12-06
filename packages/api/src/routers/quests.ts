import prisma from "@ascend/db";
import {
  InMemoryProgressStore,
  QuestEvaluationEngine,
  type QuestReward,
  questRuleSchema,
} from "@ascend/quest-engine";
import { ORPCError } from "@orpc/server";
import { z } from "zod";
import { protectedProcedure, publicProcedure } from "../index";

type QuestWithRelations = NonNullable<
  Awaited<ReturnType<typeof prisma.quest.findFirst>>
>;

type RuleProgressRecord = Awaited<
  ReturnType<typeof prisma.questRuleProgress.findMany>
>[number];

const questDifficultyEnum = z.enum(["STARTER", "SKILLED", "LEGENDARY"]);
const lifecycleEnum = z.enum(["DRAFT", "ACTIVE", "ARCHIVED"]);
const questStatusLabel = z.enum(["locked", "in_progress", "completed"]);

const questStepInput = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

const questRuleInput = questRuleSchema.omit({ questId: true }).extend({
  id: z.string().optional(),
});

const createQuestInput = z.object({
  title: z.string().min(1),
  summary: z.string().min(1).default(""),
  category: z.string().min(1),
  xp: z.number().int().nonnegative(),
  badge: z.string().optional(),
  owner: z.string().min(1).default("@nouslabs"),
  difficulty: questDifficultyEnum.default("STARTER"),
  estimatedMinutes: z.number().int().positive().default(5),
  lifecycleStatus: lifecycleEnum.default("DRAFT"),
  statusLabel: questStatusLabel.default("locked"),
  published: z.boolean().default(false),
  steps: z.array(questStepInput).default([]),
  rules: z.array(questRuleInput).default([]),
});

const listQuestsInput = z
  .object({
    wallet: z.string().optional(),
    includeDrafts: z.boolean().optional(),
  })
  .optional();

const recordActionInput = z.object({
  questId: z.string().min(1),
  wallet: z.string().min(1),
  actionId: z.string().min(1),
  actionType: z.string().min(1),
  timestamp: z.number().int().optional(),
  payload: z.record(z.unknown()).optional(),
});

export const questRouter = {
  list: publicProcedure.input(listQuestsInput).handler(async ({ input }) => {
    const includeDrafts = input?.includeDrafts ?? false;
    const wallet = input?.wallet;

    const quests = await prisma.quest.findMany({
      where: includeDrafts
        ? {}
        : {
            lifecycleStatus: "ACTIVE",
            published: true,
          },
      orderBy: { createdAt: "desc" },
      include: {
        steps: { orderBy: { position: "asc" } },
        rules: true,
      },
    });

    if (quests.length === 0) {
      return [];
    }

    const walletProgress = wallet
      ? await prisma.questRuleProgress.findMany({
          where: {
            wallet,
            questId: { in: quests.map((quest) => quest.id) },
          },
        })
      : [];

    const progressMap = new Map(
      walletProgress.map((row) => [`${row.questId}:${row.ruleId}`, row])
    );

    return quests.map((quest) =>
      toQuestSummary({
        quest,
        wallet,
        progressMap,
      })
    );
  }),
  create: protectedProcedure
    .input(createQuestInput)
    .handler(async ({ input, context }) => {
      const baseSlug = slugify(input.title);
      const slug = await resolveUniqueSlug(baseSlug);
      const steps = (
        input.steps.length ? input.steps : defaultSteps(input.title)
      ).map((step, index) => ({
        title: step.title,
        description: step.description ?? "",
        position: index,
      }));
      const normalizedRules =
        input.rules.length > 0
          ? input.rules
          : [createFallbackRule(input.title, input.xp)];

      const quest = await prisma.quest.create({
        data: {
          id: slug,
          slug,
          title: input.title,
          summary:
            input.summary ||
            `Quest auto-created via admin console for ${input.title}`,
          category: input.category,
          xp: input.xp,
          badge: input.badge,
          difficulty: input.difficulty,
          estimatedMinutes: input.estimatedMinutes,
          owner:
            input.owner ??
            context.session?.user?.name ??
            context.session?.user?.email ??
            "@nouslabs",
          lifecycleStatus: input.lifecycleStatus,
          statusLabel: input.statusLabel,
          published: input.published,
          steps: {
            createMany: {
              data: steps,
            },
          },
          rules: {
            create: normalizedRules.map((rule, index) => ({
              id: rule.id,
              name: rule.id ?? `rule-${index + 1}`,
              description: rule.description ?? `${input.title} rule`,
              conditions: rule.conditions,
              completion: rule.completion,
              reward: rule.rewards,
            })),
          },
        },
        include: {
          steps: { orderBy: { position: "asc" } },
          rules: true,
        },
      });

      return toQuestSummary({ quest });
    }),
  recordAction: publicProcedure
    .input(recordActionInput)
    .handler(async ({ input }) => {
      const quest = await prisma.quest.findUnique({
        where: { id: input.questId },
        include: { rules: true },
      });

      if (!quest) {
        throw new ORPCError("NOT_FOUND", {
          message: "Quest not found",
        });
      }

      if (quest.rules.length === 0) {
        return {
          questId: quest.id,
          wallet: input.wallet,
          evaluations: [],
          ledgerEntries: [],
        };
      }

      const existingProgress = await prisma.questRuleProgress.findMany({
        where: {
          questId: quest.id,
          wallet: input.wallet,
        },
      });

      const progressSnapshot = new Map(
        existingProgress.map((record) => [record.ruleId, record.completed])
      );

      const store = new InMemoryProgressStore();
      for (const record of existingProgress) {
        store.upsert({
          questId: record.questId,
          wallet: record.wallet,
          ruleId: record.ruleId,
          count: record.count,
          completed: record.completed,
          completedAt: record.completedAt?.getTime(),
          lastActionId: record.lastActionId ?? undefined,
        });
      }

      const engine = new QuestEvaluationEngine({ store });
      engine.loadRules(
        quest.rules.map((rule) => ({
          id: rule.id,
          questId: quest.id,
          description: rule.description ?? rule.name ?? `${quest.title} rule`,
          conditions: rule.conditions as QuestRuleInput["conditions"],
          completion: rule.completion as QuestRuleInput["completion"],
          rewards: (rule.reward as QuestReward | null) ?? undefined,
        }))
      );

      const timestamp = input.timestamp ?? Date.now();
      const evaluations = engine.evaluate({
        id: input.actionId,
        questId: quest.id,
        wallet: input.wallet,
        actionType: input.actionType,
        timestamp,
        payload: input.payload ?? {},
      });

      const ledgerEntries: {
        id: string;
        ruleId: string;
        xpAwarded: number;
        badgeId?: string | null;
      }[] = [];

      await prisma.$transaction(async (tx) => {
        await tx.questAction.upsert({
          where: { id: input.actionId },
          update: {},
          create: {
            id: input.actionId,
            questId: quest.id,
            wallet: input.wallet,
            actionType: input.actionType,
            payload: input.payload ?? {},
            timestamp: new Date(timestamp),
          },
        });

        for (const result of evaluations) {
          await tx.questRuleProgress.upsert({
            where: {
              questId_wallet_ruleId: {
                questId: quest.id,
                wallet: result.wallet,
                ruleId: result.ruleId,
              },
            },
            update: {
              count: result.progressCount,
              completed: result.completed,
              completedAt: result.completed ? new Date(timestamp) : null,
              lastActionId: result.actionId,
            },
            create: {
              questId: quest.id,
              ruleId: result.ruleId,
              wallet: result.wallet,
              count: result.progressCount,
              completed: result.completed,
              completedAt: result.completed ? new Date(timestamp) : null,
              lastActionId: result.actionId,
            },
          });

          const wasCompleted = progressSnapshot.get(result.ruleId) ?? false;
          if (result.completed && !wasCompleted && result.reward) {
            const entry = await tx.questLedgerEntry.create({
              data: {
                questId: quest.id,
                ruleId: result.ruleId,
                wallet: result.wallet,
                xpAwarded: result.reward.xp,
                badgeId: result.reward.badgeId,
                actionId: result.actionId,
              },
            });
            ledgerEntries.push({
              id: entry.id,
              ruleId: entry.ruleId,
              xpAwarded: entry.xpAwarded,
              badgeId: entry.badgeId,
            });
            progressSnapshot.set(result.ruleId, true);
          }
        }
      });

      return {
        questId: quest.id,
        wallet: input.wallet,
        evaluations,
        ledgerEntries,
      };
    }),
};

type QuestRuleInput = z.infer<typeof questRuleSchema>;

function toQuestSummary(options: {
  quest: QuestWithRelations;
  wallet?: string;
  progressMap?: Map<string, RuleProgressRecord>;
}) {
  const { quest, wallet, progressMap } = options;
  const totalRules = quest.rules.length || 1;
  const completedRules =
    progressMap && wallet
      ? quest.rules.filter(
          (rule) => progressMap.get(`${quest.id}:${rule.id}`)?.completed
        ).length
      : 0;
  const percent = totalRules
    ? Math.min(100, Math.round((completedRules / totalRules) * 100))
    : 0;
  let status: "locked" | "in_progress" | "completed" = "locked";
  if (percent >= 100) {
    status = "completed";
  } else if (completedRules > 0) {
    status = "in_progress";
  }

  return {
    id: quest.id,
    slug: quest.slug,
    title: quest.title,
    summary: quest.summary,
    category: quest.category,
    xp: quest.xp,
    badge: quest.badge,
    difficulty: quest.difficulty,
    estimatedMinutes: quest.estimatedMinutes,
    owner: quest.owner,
    lifecycleStatus: quest.lifecycleStatus,
    statusLabel: status,
    published: quest.published,
    updatedAt: quest.updatedAt.toISOString(),
    steps: quest.steps.map((step) => ({
      id: step.id,
      title: step.title,
      description: step.description,
      position: step.position,
    })),
    progress: {
      percent,
      status,
      completedRules,
      totalRules,
    },
    totalRules,
  };
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 64);
}

async function resolveUniqueSlug(base: string) {
  let slug = base;
  let suffix = 1;
  while (
    await prisma.quest.findUnique({
      where: { slug },
      select: { id: true },
    })
  ) {
    slug = `${base}-${suffix}`;
    suffix += 1;
  }
  return slug;
}

function createFallbackRule(title: string, xp: number) {
  return {
    description: `${title} default completion rule`,
    conditions: [
      {
        field: "actionType",
        operator: "equals",
        value: "quest.completed",
      },
    ],
    completion: {
      type: "eventCount" as const,
      threshold: 1,
    },
    rewards: {
      xp,
    },
  };
}

function defaultSteps(title: string) {
  return [
    {
      title: "Replay EasyConnect payload",
      description: `Verify replay data for ${title}`,
    },
    {
      title: "Validate Quest Rule",
      description: "Confirm reward logic triggers with sample payloads.",
    },
  ];
}
