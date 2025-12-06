# Technical Backlog - Milestone 4

| ID | Title | Description | Owner | Dependencies | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- |
| M4-01 | Reward Ledger Service | Implement reward worker that listens to quest completion events, applies dedupe keys, and writes XP/badge ledger rows in Postgres. Expose ORPC endpoints for dashboard queries. | @nouslabs | Quest engine events, DB package | Ledger rows created for sample completions, `bun test` covers dedupe + XP totals, ORPC handler returns paginated feed. |
| M4-02 | Badge Registry & Mint Hook | Define badge metadata schema, registry loader, and Qubic mint hook contract/API spec. Include fallbacks for retry + operator override. | @nouslabs | M4-01, contracts repo | Registry JSON + TS types checked in, contract spec documented, integration test proves badge mint payload compiles. |
| M4-03 | Leaderboard Aggregator | Build seasonal/weekly aggregation job, tie-breaker logic, and caching strategy powering apps/web leaderboard preview. | @nouslabs | Quest ledger schema | Job runnable locally via `bun run leaderboard:snapshot`, outputs deterministic fixtures consumed by tests + UI. |
| M4-04 | Reward Notifications | Publish XP/badge notifications to Discord/Notion/Zapier with shared template + retry policy. Provide sample payloads + docs. | @nouslabs | Reward ledger events | Notification templates stored in repo, tests cover payload shape, CLI script can replay sample event to each destination. |
| M4-05 | Dashboard Reward Feed | Extend apps/web to show live reward feed, badge shelf, and XP deltas sourced from the reward ledger API (mocked until backend ready). | @nouslabs | M4-01 data contract | UI renders sample feed, components covered by Storybook/Playwright snapshot (placeholder). |
| M4-06 | Status & Documentation | Keep planning.md and milestone docs updated with progress, blockers, and demo links. | @nouslabs | ongoing | Docs mention latest deployments + blockers; planning shows milestone 4 artifact list. |

## Notes
- Until GitHub billing is fixed, release workflows remain paused; document manual steps if needed.
- Reward ledger tables will eventually migrate to the shared DB package; mock adapters unblock UI work short term.
