export type ChainAction = {
  id: string;
  wallet: string;
  questId: string;
  actionType: string;
  timestamp: number;
  payload: Record<string, unknown>;
};

export type QuestReward = {
  xp: number;
  badgeId?: string;
};

export type QuestRule = {
  id: string;
  questId: string;
  description: string;
  conditions: RuleCondition[];
  completion: CompletionConfig;
  rewards?: QuestReward;
};

export type RuleConditionOperator = "equals" | "gte" | "lte" | "contains";

export type RuleCondition = {
  field: string;
  operator: RuleConditionOperator;
  value: unknown;
};

export type CompletionConfig = EventCountCompletion | FieldMatchCompletion;

export type EventCountCompletion = {
  type: "eventCount";
  threshold: number;
};

export type FieldMatchCompletion = {
  type: "fieldMatch";
  field: string;
  value: unknown;
};

export type QuestProgressRecord = {
  questId: string;
  wallet: string;
  ruleId: string;
  count: number;
  completed: boolean;
  completedAt?: number;
  lastActionId?: string;
};

export type EvaluationResult = {
  questId: string;
  wallet: string;
  ruleId: string;
  completed: boolean;
  progressCount: number;
  reward?: QuestReward;
  actionId: string;
};
