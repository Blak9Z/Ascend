# Technical Backlog – Milestone 3

| ID | Title | Description | Owner | Dependencies | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- |
| M3-01 | Quest Engine Package Scaffold | Create `packages/quest-engine` with build/test tooling. | @nouslabs | Milestone 2 artifacts | Bun build + test scripts run locally. |
| M3-02 | Rule DSL & Validation | Define Zod schema + documentation for quest rules. | @nouslabs | M3-01 | `bun test` validates sample rules JSON. |
| M3-03 | Evaluation Engine Logic | Implement rule evaluation + in-memory persistence for progress/completion. | @nouslabs | M3-02 | Tests prove quests complete when replaying fixtures. |
| M3-04 | Sample Rules + Fixtures | Store sample rule catalog + replay actions under `docs/milestone-3/samples`. | @nouslabs | M3-02 | Files referenced by tests + docs. |
| M3-05 | Integration Tests | Add Bun tests (apps/web or package) to replay fixtures and assert completions. | @nouslabs | M3-03/04 | `bun test` passes; outputs documented. |
| M3-06 | Status & Docs Update | Maintain implementation log + planning references. | @nouslabs | ongoing | Docs reflect progress. |

## Notes
- Persistence adapter currently in-memory; future milestone will swap Postgres via ORPC.
- Owner default `@nouslabs`; assign additional contributors as they join.
