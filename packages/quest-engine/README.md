# @ascend/quest-engine

Quest Evaluation Engine for Milestone 3. Provides a rule-based evaluator that consumes normalized `ChainAction` events and emits quest progress/completion with rewards.

## Scripts
- `bun run build` – bundle via tsup (ESM output)
- `bun run lint` – Biome check
- `bun test` – Bun tests using fixtures in `docs/milestone-3/samples`

## Usage
```ts
import { QuestEvaluationEngine } from "@ascend/quest-engine";
import rules from "../docs/milestone-3/samples/rules.json";

const engine = new QuestEvaluationEngine();
engine.loadRules(rules);
const result = engine.evaluate(chainAction);
```
