import type { ChainAction, QuestRuleInput } from "@ascend/quest-engine";

export const questRuleCatalog: QuestRuleInput[] = [
  {
    id: "rule-connect-profile",
    questId: "connect-profile",
    description:
      "Verify wallet ownership and capture operator profile metadata.",
    conditions: [
      {
        field: "actionType",
        operator: "equals",
        value: "qubic.QuestProgressed",
      },
    ],
    completion: {
      type: "eventCount",
      threshold: 1,
    },
    rewards: {
      xp: 50,
      badgeId: "starter-spark",
    },
  },
  {
    id: "rule-learning-sim",
    questId: "learning-sim",
    description: "Replay five onboarding payloads via @nouslabs CLI.",
    conditions: [
      {
        field: "actionType",
        operator: "equals",
        value: "qubic.XPAwarded",
      },
    ],
    completion: {
      type: "eventCount",
      threshold: 5,
    },
    rewards: {
      xp: 80,
      badgeId: "rule-crafter",
    },
  },
  {
    id: "rule-competition-dash",
    questId: "competition-dash",
    description: "Generate leaderboard snapshots with mocked XP deltas.",
    conditions: [
      {
        field: "actionType",
        operator: "equals",
        value: "qubic.LeaderboardSimulated",
      },
    ],
    completion: {
      type: "eventCount",
      threshold: 4,
    },
    rewards: {
      xp: 140,
      badgeId: "season-architect",
    },
  },
  {
    id: "rule-mastery-sweep",
    questId: "mastery-sweep",
    description:
      "Complete quests across onboarding, learning, and contribution.",
    conditions: [
      {
        field: "actionType",
        operator: "equals",
        value: "qubic.TrackCompleted",
      },
    ],
    completion: {
      type: "eventCount",
      threshold: 5,
    },
    rewards: {
      xp: 250,
      badgeId: "legendary-ember",
    },
  },
];

export const chainActionFeed: ChainAction[] = [
  {
    id: "a47bd2a655bd6688ec5fd45283a98787b1729ba9aeef5ba0aaf734d2b2982731",
    wallet: "0xabc",
    questId: "connect-profile",
    actionType: "qubic.QuestProgressed",
    timestamp: 1_733_443_200,
    payload: {
      status: 1,
      actionHash: "0x1",
    },
  },
  {
    id: "b05e4e73403416c4dea477b228daaf3c2ed9209910ec003ffca9d5d1a7d160fb",
    wallet: "0xabc",
    questId: "learning-sim",
    actionType: "qubic.XPAwarded",
    timestamp: 1_733_443_205,
    payload: {
      amount: 50,
    },
  },
  {
    id: "2df74d899fa3081a928f8127e78a973a9d765228d1b497505c3cc5b9c54dcb04",
    wallet: "0xabc",
    questId: "learning-sim",
    actionType: "qubic.XPAwarded",
    timestamp: 1_733_443_305,
    payload: {
      amount: 20,
    },
  },
  {
    id: "f46aea6bb427176bfa34302079532ac33b812c9218c2ff08e20c828a6b4768e2",
    wallet: "0xabc",
    questId: "learning-sim",
    actionType: "qubic.XPAwarded",
    timestamp: 1_733_443_405,
    payload: {
      amount: 10,
    },
  },
  {
    id: "c8f209875f678cd31e7a77083e955b6f6dba0c7c478271d9dee0f76f3bf254c6",
    wallet: "0xabc",
    questId: "competition-dash",
    actionType: "qubic.LeaderboardSimulated",
    timestamp: 1_733_443_600,
    payload: {
      iteration: 1,
    },
  },
  {
    id: "e1a29808bddc4d3441810ea3d5c6d53f28cbe1c7012074eb8cea7b86e4dd5338",
    wallet: "0xabc",
    questId: "competition-dash",
    actionType: "qubic.LeaderboardSimulated",
    timestamp: 1_733_444_200,
    payload: {
      iteration: 2,
    },
  },
];
