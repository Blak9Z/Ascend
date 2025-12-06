# Milestone 4 Audit – Rewards, Badges & Leaderboard

## Snapshot
- **Goal:** Finalize reward loop (XP, badges, leaderboard) and surface status in dashboard.
- **Status:** ⚙️ In progress — UI + docs shipped; backend ledger/notifications still mocked.

## Delivered Evidence
- `docs/milestone-4/*`: integration plan, technical backlog, reward-loop spec, badge registry, leaderboard plan, notification payloads, sample fixtures.
- Dashboard reward feed (`apps/web/src/components/rewards/reward-feed.tsx`) + mock ledger data (`apps/web/src/data/rewards.ts`).
- Planning updated with artifact references (Milestone 4 section).

## Gaps / Risks
- Reward ledger + badge minting still mock-only; no Postgres persistence yet.
- Notification pipelines + CI jobs pending until secrets + infra ready.
- Leaderboard snapshot aggregator not implemented (only plan/fixtures exist).

## Recommended Next Steps
1. Implement reward ledger service + ORPC APIs; hook dashboard to live data.
2. Wire notification templates + replay CLI, referencing docs.
3. Build leaderboard aggregation job + integrate with UI.
4. Resolve GitHub billing to run release workflows affecting reward service.

