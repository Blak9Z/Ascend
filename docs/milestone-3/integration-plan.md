# Milestone 3 – Quest Evaluation Engine

## Objectives
- Build a stateless Quest Evaluation Engine that converts normalized chain actions into quest progress and completion events.
- Provide a rule authoring DSL so ops can add/update quests without redeploying code.
- Persist quest progress snapshots (wallet + quest) with APIs/tests to replay payloads deterministically.

## Workstreams
1. **Engine Core**
   - Implement rule parsing + evaluation library with in-memory persistence.
   - Surface completion events & progress deltas for downstream services.
2. **Rule DSL + Tooling**
   - Define JSON/YAML schema for quest definitions, add validation scripts, and sample catalog.
3. **Persistence + APIs**
   - Create adapters for Postgres (future) and in-memory storage for tests.
   - Provide hooks to ORPC/API layer for dashboard consumption.
4. **Testing & Replay**
   - Replay recorded EasyConnect payloads and confirm quests auto-complete.
   - Provide Bun test suite + fixtures under `apps/web/tests`.

## Deliverables
- Quest engine package with evaluation logic + DSL definitions.
- Sample rule catalog and replay fixtures.
- Tests verifying quest completion & JSON schema validation.
- Documentation (status log, DSL guide) + CI hooks.
