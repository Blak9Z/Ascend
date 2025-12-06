"use client";

import type { EvaluationResult, QuestRuleInput } from "@ascend/quest-engine";
import { QuestEvaluationEngine } from "@ascend/quest-engine";
import { useQuery } from "@tanstack/react-query";
import type { LucideIcon } from "lucide-react";
import {
  BellRing,
  PlugZap,
  Quote,
  Shield,
  ShieldCheck,
  Sparkles,
  Trophy,
  Workflow,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { ProfileOverview } from "@/components/dashboard/profile-overview";
import { LeaderboardPreview } from "@/components/leaderboard/leaderboard-preview";
import { QuestDetail } from "@/components/quests/quest-detail";
import { QuestList } from "@/components/quests/quest-list";
import type { Quest } from "@/components/quests/types";
import { RewardFeed } from "@/components/rewards/reward-feed";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { WalletConnectPanel } from "@/components/wallet/wallet-connect-panel";
import { chainActionFeed, questRuleCatalog } from "@/data/quest-engine-samples";
import { rewardLedgerFeed } from "@/data/rewards";
import { cn } from "@/lib/utils";
import { orpc } from "@/utils/orpc";

const questBlueprints: Quest[] = [
  {
    id: "connect-profile",
    title: "Connect wallet & complete profile",
    summary:
      "Use EasyConnect to verify wallet ownership, add profile metadata, and unlock the rest of the questline.",
    category: "Onboarding",
    xp: 50,
    badge: "Starter Spark",
    status: "completed",
    progress: 100,
    difficulty: "starter",
    estimatedMinutes: 3,
    steps: [
      {
        id: "wallet",
        label: "Sign EasyConnect authentication request",
        status: "done",
        evidence: "Signature recorded 2m ago",
      },
      {
        id: "profile",
        label: "Provide role + ecosystem focus",
        status: "done",
      },
    ],
    tags: ["wallet", "profile"],
  },
  {
    id: "learning-sim",
    title: "Run quest evaluation sim",
    summary:
      "Replay recorded EasyConnect payloads using the @nouslabs SDK, confirm rules auto-complete without manual steps.",
    category: "Learning",
    xp: 80,
    badge: "Rule Crafter",
    status: "in_progress",
    progress: 65,
    difficulty: "skilled",
    estimatedMinutes: 15,
    steps: [
      {
        id: "install",
        label: "Install @nouslabs SDK + sample payloads",
        status: "done",
      },
      {
        id: "replay",
        label: "Replay 5 onboarding quests via CLI",
        status: "in_progress",
        evidence: "3/5 payloads inspected",
      },
      {
        id: "report",
        label: "Export replay coverage report",
        status: "todo",
      },
    ],
    tags: ["sdk", "replay"],
  },
  {
    id: "competition-dash",
    title: "Prototype leaderboard dash",
    summary:
      "Design the competition leaderboard view, including XP deltas, tie-breakers, and shareable summaries.",
    category: "Competition",
    xp: 140,
    badge: "Season Architect",
    status: "in_progress",
    progress: 45,
    difficulty: "skilled",
    estimatedMinutes: 20,
    steps: [
      {
        id: "wireframe",
        label: "Upload leaderboard wireframe",
        status: "done",
      },
      {
        id: "component",
        label: "Build React table with mock XP feed",
        status: "in_progress",
        evidence: "Sorting ready, pagination pending",
      },
      {
        id: "share",
        label: "Hook share-to-Discord CTA",
        status: "todo",
      },
    ],
    tags: ["ui", "leaderboard"],
  },
  {
    id: "mastery-sweep",
    title: "Complete cross-category mastery sweep",
    summary:
      "Finish quests in onboarding, learning, and contribution tracks to unlock the Legendary Ember badge.",
    category: "Mastery",
    xp: 250,
    badge: "Legendary Ember",
    status: "locked",
    progress: 0,
    difficulty: "legendary",
    estimatedMinutes: 35,
    steps: [
      {
        id: "track",
        label: "Finish 5 quests across 3 categories",
        status: "todo",
      },
      {
        id: "share-proof",
        label: "Share proof bundle to Discord + Notion",
        status: "todo",
      },
    ],
    tags: ["mastery"],
  },
];

const leaderboardEntries = [
  {
    rank: 1,
    handle: "@nouslabs",
    xp: 3120,
    questsCompleted: 18,
    streakDays: 7,
  },
  {
    rank: 2,
    handle: "@questpilot",
    xp: 2760,
    questsCompleted: 15,
    streakDays: 5,
  },
  {
    rank: 3,
    handle: "@orbitaltrain",
    xp: 2500,
    questsCompleted: 14,
    streakDays: 4,
  },
  {
    rank: 4,
    handle: "@chainrookie",
    xp: 2010,
    questsCompleted: 11,
    streakDays: 3,
  },
  {
    rank: 5,
    handle: "@badgebard",
    xp: 1875,
    questsCompleted: 10,
    streakDays: 2,
  },
];

const notificationChannels = [
  {
    id: "discord",
    label: "Discord",
    description: "Post quest completions to the ops channel in real time.",
    docsUrl: "https://docs.ascend.quest/notifications/discord",
  },
  {
    id: "notion",
    label: "Notion",
    description: "Sync quest retros + operator notes to the playbook DB.",
    docsUrl: "https://docs.ascend.quest/notifications/notion",
  },
  {
    id: "sheets",
    label: "Sheets",
    description: "Append XP deltas to revenue attribution workbook.",
    docsUrl: "https://docs.ascend.quest/notifications/sheets",
  },
  {
    id: "zapier",
    label: "Zapier",
    description: "Trigger downstream automations once milestone 1 stabilizes.",
    docsUrl: "https://docs.ascend.quest/notifications/zapier",
  },
];

const badgeShelf = [
  { id: "starter", label: "Starter Spark", tier: "Starter" },
  { id: "rule", label: "Rule Crafter", tier: "Skill" },
  { id: "season", label: "Season Architect", tier: "Competitive" },
];

const heroHighlights: {
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    icon: PlugZap,
    title: "EasyConnect native",
    description: "Ingest signatures + payloads directly from the webhook bus.",
  },
  {
    icon: Trophy,
    title: "Rules to rewards",
    description: "Quest DSL auto-issues XP, badges, and leaderboard deltas.",
  },
  {
    icon: BellRing,
    title: "Operator ready",
    description: "Notify Discord, Notion, Sheets, or Zapier without glue code.",
  },
];

const productStats = [
  {
    label: "Quests automated",
    value: "250+",
    description: "season-ready templates powered by rule DSL",
  },
  {
    label: "XP issued",
    value: "3.4M",
    description: "tracked through reward ledger + badge registry",
  },
  {
    label: "Integrations",
    value: "12",
    description: "EasyConnect, Discord, Notion, Sheets, Zapier & more",
  },
  {
    label: "Time to ship",
    value: "<48h",
    description: "from replaying payloads to live questlines",
  },
];

const productHighlights: {
  icon: LucideIcon;
  title: string;
  badge: string;
  description: string;
}[] = [
  {
    icon: Workflow,
    badge: "Automation",
    title: "Quest engine + reward ledger",
    description:
      "Normalize chain actions, evaluate rules, and emit XP/badge snapshots for any questline.",
  },
  {
    icon: ShieldCheck,
    badge: "Governance",
    title: "Admin overrides & audit trails",
    description:
      "Resolve edge cases, adjust XP, and keep a tamper-proof history across quest operations.",
  },
  {
    icon: PlugZap,
    badge: "Integrations",
    title: "Notifications that ship themselves",
    description:
      "Replay payloads to Discord, Notion, Sheets, or Zapier with templated layouts and retries.",
  },
];

const integrationLogos = [
  "EasyConnect",
  "Discord",
  "Notion",
  "Sheets",
  "Zapier",
  "Slack",
  "Notifi",
];

const workflowStages = [
  {
    step: "01",
    title: "Capture EasyConnect payloads",
    description:
      "Ingest signatures, metadata, and quest IDs directly from the webhook bus.",
  },
  {
    step: "02",
    title: "Evaluate rule catalog",
    description:
      "Quest DSL matches conditions and emits deterministic progress + completion events.",
  },
  {
    step: "03",
    title: "Issue XP, badges, notifications",
    description:
      "Reward ledger handles XP deltas, badge mint hooks, and outbound comms automatically.",
  },
];

const testimonials = [
  {
    quote:
      "Ascend lets us replay an entire onboarding program without writing cron jobs or spreadsheets. We ship quests in hours, not weeks.",
    author: "Mira Patel",
    role: "Growth Lead, @nouslabs",
  },
  {
    quote:
      "Operators finally get the control room they deserve—quest rules, reward overrides, and notifications all live in one stack.",
    author: "Leo Carter",
    role: "Ecosystem Ops, Qubic Collective",
  },
];

const systemsStatus = [
  {
    system: "Webhook Receiver",
    status: "Healthy",
    latency: "120ms p95",
    region: "iad",
  },
  {
    system: "Quest Engine",
    status: "Healthy",
    latency: "180ms p95",
    region: "dfw",
  },
  {
    system: "Reward Ledger",
    status: "Degraded",
    latency: "320ms p95",
    region: "iad",
  },
  {
    system: "Notifications",
    status: "Healthy",
    latency: "90ms p95",
    region: "dfw",
  },
];

const opsChecklist = [
  {
    title: "Replay milestone payloads",
    description: "Validate quest DSL against latest EasyConnect captures.",
    owner: "@nouslabs",
    due: "Today",
  },
  {
    title: "Badge registry sync",
    description: "Upload new badge art + metadata to IPFS and contracts.",
    owner: "@design_ops",
    due: "Tomorrow",
  },
  {
    title: "Notification secrets",
    description: "Rotate Discord + Notion credentials before beta launch.",
    owner: "@infra",
    due: "Friday",
  },
];

export default function Home() {
  const fallbackQuests = useMemo(
    () => deriveQuestProgress(questBlueprints),
    []
  );
  const [quests, setQuests] = useState<Quest[]>(fallbackQuests);
  const [selectedQuestId, setSelectedQuestId] = useState(
    () =>
      fallbackQuests.find((quest) => quest.status !== "locked")?.id ??
      fallbackQuests[0]?.id ??
      ""
  );
  const questQuery = useQuery(orpc.quests.list.queryOptions());
  const remoteQuests = useMemo(
    () =>
      questQuery.data && questQuery.data.length > 0
        ? questQuery.data.map(mapServerQuestToQuest)
        : null,
    [questQuery.data]
  );

  useEffect(() => {
    if (remoteQuests && remoteQuests.length > 0) {
      setQuests(remoteQuests);
    }
  }, [remoteQuests]);

  useEffect(() => {
    if (!quests.length) {
      return;
    }
    if (!quests.some((quest) => quest.id === selectedQuestId)) {
      const fallback =
        quests.find((quest) => quest.status !== "locked") ?? quests[0];
      setSelectedQuestId(fallback.id);
    }
  }, [quests, selectedQuestId]);

  const selectedQuest = useMemo(
    () => quests.find((quest) => quest.id === selectedQuestId) ?? quests[0],
    [quests, selectedQuestId]
  );

  return (
    <main className="bg-muted/40 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-3xl border border-primary/20 bg-linear-to-br from-card via-card/95 to-primary/5 p-6 shadow-sm sm:p-8">
          <div className="space-y-5">
            <div className="space-y-3">
              <p className="text-primary text-xs uppercase tracking-[0.35em]">
                Ascend Quest Engine
              </p>
              <h1 className="font-semibold text-3xl sm:text-4xl">
                Convert on-chain activity into live quests, rewards, and
                notifications.
              </h1>
              <p className="max-w-3xl text-muted-foreground">
                Orchestrate wallet onboarding, learning programs, and
                competitions without manual review. Replay EasyConnect payloads,
                evaluate rules, and watch rewards, badges, and notifications
                fire instantly.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button asChild className="min-w-[200px]" size="lg">
                <Link href="/admin">
                  <Sparkles className="mr-2 size-5" />
                  Launch Quest Creator
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="https://docs.ascend.quest" target="_blank">
                  View product brief
                </Link>
              </Button>
            </div>
            <div className="grid gap-4 sm:grid-cols-3">
              {heroHighlights.map((highlight) => {
                const Icon = highlight.icon;
                return (
                  <div
                    className="rounded-2xl border border-white/10 bg-background/80 p-4"
                    key={highlight.title}
                  >
                    <Icon className="mb-2 size-5 text-primary" />
                    <p className="font-semibold">{highlight.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {highlight.description}
                    </p>
                  </div>
                );
              })}
            </div>
            <div id="wallet-auth">
              <WalletConnectPanel />
            </div>
          </div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {productStats.map((stat) => (
            <Card className="border-muted/60 bg-card/80" key={stat.label}>
              <CardContent className="space-y-2 p-4">
                <p className="text-muted-foreground text-xs uppercase tracking-widest">
                  {stat.label}
                </p>
                <p className="font-semibold text-3xl">{stat.value}</p>
                <p className="text-muted-foreground text-sm">
                  {stat.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </section>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <QuestDetail quest={selectedQuest} />
            <section>
              <div className="mb-3 flex items-center justify-between">
                <h2 className="font-semibold text-lg">Active quest board</h2>
                <Button size="sm" variant="ghost">
                  View catalog
                </Button>
              </div>
              <QuestList
                activeQuestId={selectedQuest.id}
                onSelect={(quest) => setSelectedQuestId(quest.id)}
                quests={quests}
              />
            </section>
          </div>

          <aside className="space-y-6">
            <ProfileOverview
              badges={badgeShelf}
              handle="@nouslabs"
              level={12}
              streakDays={5}
              xp={1820}
            />
            <NotificationsPanel channels={notificationChannels} />
            <LeaderboardPreview entries={leaderboardEntries} />
            <RewardFeed entries={rewardLedgerFeed} />
          </aside>
        </div>

        <section className="rounded-2xl border border-muted/60 bg-card p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-primary text-xs uppercase tracking-[0.3em]">
                Why operators pick Ascend
              </p>
              <h2 className="font-semibold text-2xl">
                Full-stack quest operations without extra dashboards
              </h2>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {productHighlights.map((highlight) => {
              const Icon = highlight.icon;
              return (
                <Card
                  className="border-muted/60 bg-background/80"
                  key={highlight.title}
                >
                  <CardContent className="space-y-3 p-4">
                    <div className="inline-flex items-center gap-2 text-muted-foreground text-xs uppercase tracking-widest">
                      <Icon className="size-4 text-primary" />
                      {highlight.badge}
                    </div>
                    <p className="font-semibold text-lg">{highlight.title}</p>
                    <p className="text-muted-foreground text-sm">
                      {highlight.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <section className="rounded-2xl border border-muted/60 bg-card p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-primary text-xs uppercase tracking-[0.3em]">
                Operations dashboard
              </p>
              <h2 className="font-semibold text-2xl">Live system health</h2>
            </div>
            <Button size="sm" variant="outline">
              View observability
            </Button>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {systemsStatus.map((system) => (
              <Card
                className="border-muted/60 bg-background/80"
                key={system.system}
              >
                <CardContent className="space-y-2 p-4">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold">{system.system}</p>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 font-semibold text-xs",
                        system.status === "Healthy"
                          ? "border-emerald-500/50 text-emerald-600"
                          : "border-amber-500/50 text-amber-600"
                      )}
                    >
                      {system.status}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {system.latency}
                  </p>
                  <p className="text-muted-foreground text-xs uppercase tracking-widest">
                    {system.region}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-muted/60 bg-card p-6">
          <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-primary text-xs uppercase tracking-[0.3em]">
                Runbook
              </p>
              <h2 className="font-semibold text-2xl">Operator checklist</h2>
            </div>
            <Button size="sm" variant="ghost">
              Open in Admin
            </Button>
          </div>
          <div className="space-y-4">
            {opsChecklist.map((item) => (
              <div
                className="rounded-xl border border-muted/70 bg-background/70 p-4"
                key={item.title}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="font-semibold">{item.title}</p>
                  <span className="text-muted-foreground text-xs uppercase tracking-widest">
                    Due {item.due}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
                <p className="text-primary text-xs uppercase tracking-widest">
                  Owner · {item.owner}
                </p>
              </div>
            ))}
          </div>
        </section>
        <section className="rounded-2xl border border-muted/60 bg-card p-6">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-primary text-xs uppercase tracking-[0.3em]">
                Integrations
              </p>
              <h2 className="font-semibold text-2xl">
                Plug into the ops stack you already use
              </h2>
            </div>
            <Shield className="hidden size-6 text-primary sm:block" />
          </div>
          <div className="flex flex-wrap gap-3">
            {integrationLogos.map((logo) => (
              <span
                className="rounded-full border border-muted px-4 py-2 font-semibold text-sm"
                key={logo}
              >
                {logo}
              </span>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-muted/60 bg-card p-6">
          <div className="mb-6">
            <p className="text-primary text-xs uppercase tracking-[0.3em]">
              Workflow
            </p>
            <h2 className="font-semibold text-2xl">
              From payload to reward in minutes
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {workflowStages.map((stage) => (
              <Card
                className="border-primary/20 bg-background/80"
                key={stage.step}
              >
                <CardContent className="space-y-3 p-4">
                  <div className="font-semibold text-primary text-sm">
                    {stage.step}
                  </div>
                  <p className="font-semibold text-lg">{stage.title}</p>
                  <p className="text-muted-foreground text-sm">
                    {stage.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-muted/60 bg-card p-6">
          <div className="mb-6">
            <p className="text-primary text-xs uppercase tracking-[0.3em]">
              Operators love it
            </p>
            <h2 className="font-semibold text-2xl">Testimonials</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {testimonials.map((testimonial) => (
              <Card
                className="border-muted/60 bg-background/80"
                key={testimonial.author}
              >
                <CardContent className="space-y-4 p-4">
                  <Quote className="size-5 text-primary" />
                  <p className="text-muted-foreground">{testimonial.quote}</p>
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-muted-foreground text-sm">
                      {testimonial.role}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section className="rounded-3xl border border-primary/30 bg-linear-to-br from-primary/5 via-card to-background p-6 sm:p-8">
          <div className="grid gap-6 sm:grid-cols-[2fr_1fr] sm:items-center">
            <div className="space-y-3">
              <p className="text-primary text-xs uppercase tracking-[0.3em]">
                Ready to launch?
              </p>
              <h2 className="font-semibold text-3xl sm:text-4xl">
                Quest operations, governance, and notifications in one stack.
              </h2>
              <p className="text-muted-foreground">
                Wire up your EasyConnect payloads and start shipping quests that
                reward users the second they act on-chain.
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <Button asChild className="min-w-[200px]" size="lg">
                <Link href="/admin">
                  <Sparkles className="mr-2 size-5" />
                  Launch Quest Creator
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="mailto:ops@ascend.quest">Talk to ops</Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

type ServerQuestSummary = Awaited<
  ReturnType<(typeof orpc)["quests"]["list"]["call"]>
>[number];

function mapServerQuestToQuest(summary: ServerQuestSummary): Quest {
  const difficultyMap: Record<string, Quest["difficulty"]> = {
    STARTER: "starter",
    SKILLED: "skilled",
    LEGENDARY: "legendary",
  };
  const overallStatus = summary.progress.status;
  const steps =
    summary.steps.length > 0
      ? summary.steps.map(
          (step: ServerQuestSummary["steps"][number], index: number) => ({
            id: step.id,
            label: step.title,
            status: deriveStepStatus(overallStatus, index),
            evidence:
              overallStatus === "completed"
                ? "Completed via quest engine"
                : undefined,
          })
        )
      : [
          {
            id: `${summary.id}-auto`,
            label: "Auto-generated milestone",
            status:
              overallStatus === "completed"
                ? ("done" as const)
                : ("todo" as const),
          },
        ];

  return {
    id: summary.id,
    title: summary.title,
    summary: summary.summary,
    category: summary.category,
    xp: summary.xp,
    badge: summary.badge ?? "Custom Badge",
    status: overallStatus,
    progress: summary.progress.percent,
    difficulty: difficultyMap[summary.difficulty] ?? "starter",
    estimatedMinutes: summary.estimatedMinutes ?? 5,
    steps,
    tags: [summary.category.toLowerCase()],
  };
}

function deriveStepStatus(
  questStatus: Quest["status"],
  index: number
): Quest["steps"][number]["status"] {
  if (questStatus === "completed") {
    return "done";
  }
  if (questStatus === "in_progress" && index === 0) {
    return "in_progress";
  }
  return "todo";
}

function deriveQuestProgress(baseQuests: Quest[]) {
  const engine = new QuestEvaluationEngine();
  engine.loadRules(questRuleCatalog);

  const completionMap = new Map<string, QuestRuleInput["completion"]>();
  for (const rule of questRuleCatalog) {
    completionMap.set(rule.questId, rule.completion);
  }

  const snapshots = new Map<string, EvaluationResult>();
  for (const action of chainActionFeed) {
    const evaluations = engine.evaluate(action);
    for (const result of evaluations) {
      const current = snapshots.get(result.questId);
      if (!current || result.progressCount >= current.progressCount) {
        snapshots.set(result.questId, result);
      }
    }
  }

  return baseQuests.map((quest) => {
    const completion = completionMap.get(quest.id);
    const snapshot = snapshots.get(quest.id);

    const computedProgress = computeQuestProgress(snapshot, completion);
    let status: Quest["status"] = quest.status;
    if (snapshot?.completed) {
      status = "completed";
    } else if (snapshot?.progressCount) {
      status = "in_progress";
    }

    return {
      ...quest,
      status,
      progress:
        computedProgress > 0 || snapshot?.completed
          ? computedProgress
          : quest.progress,
    };
  });
}

function computeQuestProgress(
  snapshot: EvaluationResult | undefined,
  completion: QuestRuleInput["completion"] | undefined
) {
  if (!completion) {
    return snapshot?.completed ? 100 : 0;
  }

  if (completion.type === "eventCount") {
    const threshold = completion.threshold;
    const count = snapshot?.progressCount ?? 0;
    const ratio = Math.min(1, count / threshold);
    return Math.round(ratio * 100);
  }

  if (completion.type === "fieldMatch") {
    return snapshot?.completed ? 100 : 0;
  }

  return 0;
}
