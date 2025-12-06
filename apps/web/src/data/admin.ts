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
