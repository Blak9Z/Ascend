import type { QuestStatus } from "@/components/quests/types";

export type AdminQuestRecord = {
  id: string;
  title: string;
  category: string;
  status: QuestStatus;
  xp: number;
  badge: string;
  owner: string;
  published: boolean;
  updatedAt: string;
};

export type OverrideRequest = {
  id: string;
  questId: string;
  wallet: string;
  action: "complete" | "revoke" | "adjust_xp";
  xpDelta: number;
  badge?: string;
  status: "pending" | "approved" | "rejected";
  submittedAt: string;
  reviewer?: string;
};

export type NotificationLog = {
  id: string;
  questId: string;
  channel: "discord" | "notion" | "sheets" | "zapier";
  status: "sent" | "retrying" | "failed";
  attempt: number;
  issuedAt: string;
};

export const adminQuestRecords: AdminQuestRecord[] = [
  {
    id: "connect-profile",
    title: "Connect wallet & complete profile",
    category: "Onboarding",
    status: "completed",
    xp: 50,
    badge: "Starter Spark",
    owner: "@nouslabs",
    published: true,
    updatedAt: "2025-12-05T18:30:00Z",
  },
  {
    id: "learning-sim",
    title: "Run quest evaluation sim",
    category: "Learning",
    status: "in_progress",
    xp: 80,
    badge: "Rule Crafter",
    owner: "@nouslabs",
    published: true,
    updatedAt: "2025-12-05T23:45:00Z",
  },
  {
    id: "competition-dash",
    title: "Prototype leaderboard dash",
    category: "Competition",
    status: "in_progress",
    xp: 140,
    badge: "Season Architect",
    owner: "@design_ops",
    published: false,
    updatedAt: "2025-12-04T16:05:00Z",
  },
  {
    id: "mastery-sweep",
    title: "Complete cross-category mastery sweep",
    category: "Mastery",
    status: "locked",
    xp: 250,
    badge: "Legendary Ember",
    owner: "@growth_ops",
    published: false,
    updatedAt: "2025-12-03T11:15:00Z",
  },
];

export const pendingOverrides: OverrideRequest[] = [
  {
    id: "ovr-001",
    questId: "learning-sim",
    wallet: "0xbeef",
    action: "adjust_xp",
    xpDelta: 30,
    badge: "Rule Crafter",
    status: "pending",
    submittedAt: "2025-12-05T21:12:00Z",
  },
  {
    id: "ovr-002",
    questId: "competition-dash",
    wallet: "0x42",
    action: "complete",
    xpDelta: 140,
    status: "pending",
    submittedAt: "2025-12-05T22:04:00Z",
  },
];

export const notificationLogs: NotificationLog[] = [
  {
    id: "log-001",
    questId: "connect-profile",
    channel: "discord",
    status: "sent",
    attempt: 1,
    issuedAt: "2025-12-05T18:31:00Z",
  },
  {
    id: "log-002",
    questId: "learning-sim",
    channel: "notion",
    status: "retrying",
    attempt: 2,
    issuedAt: "2025-12-05T23:46:10Z",
  },
  {
    id: "log-003",
    questId: "competition-dash",
    channel: "sheets",
    status: "sent",
    attempt: 1,
    issuedAt: "2025-12-05T16:06:22Z",
  },
  {
    id: "log-004",
    questId: "mastery-sweep",
    channel: "zapier",
    status: "failed",
    attempt: 3,
    issuedAt: "2025-12-05T12:10:45Z",
  },
];
