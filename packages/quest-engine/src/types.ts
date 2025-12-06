export interface ChainAction {
  id: string;
  wallet: string;
  questId: string;
  actionType: string;
  timestamp: number;
  payload: Record<string, unknown>;
}

export interface QuestReward {
  xp: number;
  badgeId?: string;
}

export interface QuestRule {
  id: string;
  questId: string;
  description: string;
  conditions: RuleCondition[];
  completion: CompletionConfig;
  rewards?: QuestReward;
}

export type RuleConditionOperator = "equals" | "gte" | "lte" | "contains";

export interface RuleCondition {
  field: string;
  operator: RuleConditionOperator;
  value: unknown;
}

export type CompletionConfig = EventCountCompletion | FieldMatchCompletion;

export interface EventCountCompletion {
  type: "eventCount";
  threshold: number;
}

export interface FieldMatchCompletion {
  type: "fieldMatch";
  field: string;
  value: unknown;
}

export interface QuestProgressRecord {
  questId: string;
  wallet: string;
  ruleId: string;
  count: number;
  completed: boolean;
  completedAt?: number;
  lastActionId?: string;
}

export interface EvaluationResult {
  questId: string;
  wallet: string;
  ruleId: string;
  completed: boolean;
  progressCount: number;
  reward?: QuestReward;
  actionId: string;
}
