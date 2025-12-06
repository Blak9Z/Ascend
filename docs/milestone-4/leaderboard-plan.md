# Leaderboard Plan - Milestone 4

## Goals
- Produce weekly + seasonal leaderboards that reflect XP, completion time, and streak tie-breakers.
- Expose cached snapshots to apps/web and external partners without hitting raw ledger tables.
- Support “shareable summaries” (Discord/Notion) with consistent formatting.

## Aggregation Strategy
1. **Ingest** reward ledger rows (wallet, questId, xpDelta, issuedAt, badgeId).
2. **Normalize** into per-wallet stats:
   - `totalXp`
   - `questsCompleted`
   - `streakDays` (`issuedAt` gaps >36h reset counter)
   - `lastCompletionAt`
3. **Rank** entries by:
   1. `totalXp` (desc)
   2. `lastCompletionAt` (asc)
   3. `streakDays` (desc)
4. **Snapshot** JSON into `leaderboard_snapshots` table (season, week, payload, generatedAt).

## CLI / Job
- Command: `bun run leaderboard:snapshot --season S0 --week 5`
- Steps:
  - Query ledger rows in window.
  - Compute ranks via deterministic reducer.
  - Write snapshot + emit `LeaderboardSnapshotCreated` event.
- Deterministic fixtures live in `docs/milestone-4/samples/leaderboard-week5.json`.

## API Surface
| Endpoint | Description |
| --- | --- |
| `GET /api/leaderboard/current` | Returns latest snapshot for active season. |
| `GET /api/leaderboard/:season/:week` | Fetches specific weekly snapshot. |
| `POST /api/leaderboard/recompute` | Protected endpoint to re-run aggregation (ops only). |

```ts
type LeaderboardEntry = {
  rank: number;
  wallet: string;
  handle?: string;
  totalXp: number;
  questsCompleted: number;
  streakDays: number;
  lastCompletionAt: string;
};
```

## Dashboard Integration
- `apps/web` consumes `/api/leaderboard/current`.
- `LeaderboardPreview` component accepts `LeaderboardEntry[]`.
- Add CTA for “View full leaderboard” linking to admin panel when ready.

## Open Tasks
- Schema migration for `leaderboard_snapshots`.
- Replay script hooking into EasyConnect sample data.
- Notifications (Discord embed) triggered when `rank <= 3` changes.
