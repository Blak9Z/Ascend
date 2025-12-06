"use client";

import type { EvaluationResult, QuestRuleInput } from "@ascend/quest-engine";
import { QuestEvaluationEngine } from "@ascend/quest-engine";
import { Sparkles } from "lucide-react";
import { useMemo, useState } from "react";
import { NotificationsPanel } from "@/components/dashboard/notifications-panel";
import { ProfileOverview } from "@/components/dashboard/profile-overview";
import { LeaderboardPreview } from "@/components/leaderboard/leaderboard-preview";
import { MilestoneTimeline } from "@/components/milestones/milestone-timeline";
import { QuestDetail } from "@/components/quests/quest-detail";
import { QuestList } from "@/components/quests/quest-list";
import type { Quest } from "@/components/quests/types";
import { RewardFeed } from "@/components/rewards/reward-feed";
import { Button } from "@/components/ui/button";
import { milestoneSummaries } from "@/data/milestones";
import { chainActionFeed, questRuleCatalog } from "@/data/quest-engine-samples";
import { rewardLedgerFeed } from "@/data/rewards";

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
    docsUrl: "https://docs.ascent.quest/notifications/discord",
  },
  {
    id: "notion",
    label: "Notion",
    description: "Sync quest retros + operator notes to the playbook DB.",
    docsUrl: "https://docs.ascent.quest/notifications/notion",
  },
  {
    id: "sheets",
    label: "Sheets",
    description: "Append XP deltas to revenue attribution workbook.",
    docsUrl: "https://docs.ascent.quest/notifications/sheets",
  },
  {
    id: "zapier",
    label: "Zapier",
    description: "Trigger downstream automations once milestone 1 stabilizes.",
    docsUrl: "https://docs.ascent.quest/notifications/zapier",
  },
];

const badgeShelf = [
  { id: "starter", label: "Starter Spark", tier: "Starter" },
  { id: "rule", label: "Rule Crafter", tier: "Skill" },
  { id: "season", label: "Season Architect", tier: "Competitive" },
];

export default function Home() {
  const quests = useMemo(() => deriveQuestProgress(questBlueprints), []);
  const [selectedQuestId, setSelectedQuestId] = useState(
    () => quests.find((quest) => quest.status !== "locked")?.id ?? quests[0].id
  );

  const selectedQuest = useMemo(
    () => quests.find((quest) => quest.id === selectedQuestId) ?? quests[0],
    [quests, selectedQuestId]
  );

  return (
    <main className="bg-muted/40 p-4 sm:p-6">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6">
        <section className="rounded-2xl border border-primary/20 bg-card p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <div className="space-y-2">
              <p className="text-primary text-xs uppercase tracking-widest">
                Milestone 1 control room
              </p>
              <h1 className="font-semibold text-2xl sm:text-3xl">
                Ascent quest engine dashboard
              </h1>
              <p className="max-w-2xl text-muted-foreground text-sm">
                Track onboarding, learning, and competition quests curated by
                @nouslabs. Once chain hooks land, plug these views into live
                data with zero redesign.
              </p>
            </div>
            <Button className="min-w-[220px]" size="lg">
              <Sparkles className="size-5" /> Launch Quest Creator
            </Button>
          </div>
        </section>

        <MilestoneTimeline milestones={milestoneSummaries} />

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
      </div>
    </main>
  );
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
