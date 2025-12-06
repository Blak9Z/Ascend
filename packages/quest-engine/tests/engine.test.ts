import { describe, expect, test } from "bun:test";

import rules from "../../../docs/milestone-3/samples/rules.json";
import actions from "../../../docs/milestone-3/samples/chain-actions.json";
import { QuestEvaluationEngine } from "../src/index.ts";
import type { ChainAction } from "../src/types.ts";

const typedRules = rules as Parameters<QuestEvaluationEngine["loadRules"]>[0];
const typedActions = actions as ChainAction[];

describe("QuestEvaluationEngine", () => {
  test("completes connect-profile on first eligible action", () => {
    const engine = new QuestEvaluationEngine();
    engine.loadRules(typedRules);

    const result = engine.evaluate(typedActions[0]);
    expect(result[0]?.completed).toBe(true);
    expect(result[0]?.reward?.xp).toBe(50);
  });
});
