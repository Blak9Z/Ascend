export type RewardLedgerEntry = {
  id: string;
  questId: string;
  questTitle: string;
  wallet: string;
  handle: string;
  xpDelta: number;
  badge?: string;
  issuedAt: string;
  streakDays: number;
  deliveryChannels: ("discord" | "notion" | "sheets" | "zapier")[];
};

export const rewardLedgerFeed: RewardLedgerEntry[] = [
  {
    id: "ledger-001",
    questId: "connect-profile",
    questTitle: "Connect wallet & complete profile",
    wallet: "0xabc",
    handle: "@nouslabs",
    xpDelta: 50,
    badge: "Starter Spark",
    issuedAt: "2025-12-06T01:57:00Z",
    streakDays: 7,
    deliveryChannels: ["discord", "notion"],
  },
  {
    id: "ledger-002",
    questId: "learning-sim",
    questTitle: "Run quest evaluation sim",
    wallet: "0xabc",
    handle: "@nouslabs",
    xpDelta: 80,
    badge: "Rule Crafter",
    issuedAt: "2025-12-06T02:05:00Z",
    streakDays: 7,
    deliveryChannels: ["discord", "sheets", "zapier"],
  },
  {
    id: "ledger-003",
    questId: "competition-dash",
    questTitle: "Prototype leaderboard dash",
    wallet: "0xabc",
    handle: "@nouslabs",
    xpDelta: 140,
    issuedAt: "2025-12-06T02:12:00Z",
    streakDays: 8,
    deliveryChannels: ["notion"],
  },
  {
    id: "ledger-004",
    questId: "mastery-sweep",
    questTitle: "Complete cross-category mastery sweep",
    wallet: "0xabc",
    handle: "@nouslabs",
    xpDelta: 250,
    badge: "Legendary Ember",
    issuedAt: "2025-12-06T02:21:00Z",
    streakDays: 9,
    deliveryChannels: ["discord", "zapier"],
  },
];
