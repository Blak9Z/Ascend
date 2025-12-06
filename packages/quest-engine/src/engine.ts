import { questRuleCatalogSchema } from "./dsl";
import { InMemoryProgressStore, type ProgressStore } from "./persistence";
import type {
  ChainAction,
  EvaluationResult,
  QuestProgressRecord,
  QuestRule,
  QuestRuleInput,
} from "./types";

export type QuestEvaluationEngineOptions = {
  store?: ProgressStore;
};

export class QuestEvaluationEngine {
  private rules: QuestRule[] = [];
  private readonly store: ProgressStore;

  constructor(options: QuestEvaluationEngineOptions = {}) {
    this.store = options.store ?? new InMemoryProgressStore();
  }

  loadRules(inputs: QuestRuleInput[]) {
    const parsed = questRuleCatalogSchema.parse(inputs);
    this.rules = parsed;
  }

  evaluate(action: ChainAction): EvaluationResult[] {
    return this.rules
      .filter((rule) => rule.questId === action.questId)
      .flatMap((rule) => this.evaluateRule(rule, action));
  }

  private evaluateRule(
    rule: QuestRule,
    action: ChainAction
  ): EvaluationResult[] {
    const conditionsMet = rule.conditions.every((condition) =>
      this.evaluateCondition(condition, action)
    );

    if (!conditionsMet) {
      return [];
    }

    const existing = this.store.get(rule.questId, action.wallet);
    const record: QuestProgressRecord = existing ?? {
      questId: rule.questId,
      wallet: action.wallet,
      ruleId: rule.id,
      count: 0,
      completed: false,
    };

    record.count += 1;
    record.lastActionId = action.id;

    const completed = this.checkCompletion(rule, action, record);
    record.completed = record.completed || completed;
    if (completed) {
      record.completedAt = action.timestamp;
    }

    this.store.upsert(record);

    return [
      {
        questId: record.questId,
        wallet: record.wallet,
        ruleId: record.ruleId,
        completed: record.completed,
        progressCount: record.count,
        reward: record.completed ? rule.rewards : undefined,
        actionId: action.id,
      },
    ];
  }

  private evaluateCondition(
    condition: QuestRule["conditions"][number],
    action: ChainAction
  ) {
    const value = this.extractField(action, condition.field);
    switch (condition.operator) {
      case "equals":
        return value === condition.value;
      case "gte":
        return typeof value === "number" && typeof condition.value === "number"
          ? value >= condition.value
          : false;
      case "lte":
        return typeof value === "number" && typeof condition.value === "number"
          ? value <= condition.value
          : false;
      case "contains":
        return Array.isArray(value) ? value.includes(condition.value) : false;
      default:
        return false;
    }
  }

  private extractField(action: ChainAction, fieldPath: string) {
    if (fieldPath === "actionType") {
      return action.actionType;
    }
    const parts = fieldPath.split(".");
    let current: unknown = action;
    for (const part of parts) {
      if (part === "payload") {
        current = action.payload;
        continue;
      }
      if (typeof current !== "object" || current === null) {
        return;
      }
      const record = current as Record<string, unknown>;
      if (!(part in record)) {
        return;
      }
      current = record[part];
    }
    return current;
  }

  private checkCompletion(
    rule: QuestRule,
    action: ChainAction,
    record: QuestProgressRecord
  ) {
    if (record.completed) {
      return false;
    }

    if (rule.completion.type === "eventCount") {
      return record.count >= rule.completion.threshold;
    }

    if (rule.completion.type === "fieldMatch") {
      const value = this.extractField(action, rule.completion.field);
      return value === rule.completion.value;
    }

    return false;
  }
}
