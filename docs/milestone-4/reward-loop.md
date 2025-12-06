# Reward Loop Architecture (Milestone 4)

## Event Flow
1. Quest engine emits `QuestCompleted` events (wallet, questId, ruleId, rewards metadata).
2. Reward worker ingests events via queue/topic, dedupes using `wallet+questId+actionId`, and computes XP/badge delta.
3. Ledger tables capture:
   - `reward_ledger` – immutable entries for XP/badge grants.
   - `badge_state` – latest badge ownership + minted tx hash.
   - `xp_snapshot` – aggregated XP totals per wallet/season.
4. Notifications + leaderboard jobs subscribe to ledger append events.

## APIs & Contracts
- `POST /api/rewards/replay` – (dev only) replays sample payloads for QA.
- `GET /api/rewards/feed` – returns paginated ledger entries (used by dashboard reward feed).
- `GET /api/leaderboard/snapshot?season=current` – surfaces aggregated XP/streak metrics.

## Data Contracts
```ts
type RewardLedgerEntry = {
  id: string;
  wallet: string;
  questId: string;
  xpDelta: number;
  badgeId?: string;
  mintedTx?: string;
  issuedAt: string;
  source: "quest-engine" | "manual-adjustment";
};
```

## Notification Template Fields
- `wallet_handle`, `quest_title`, `xp_delta`, `badge_label`, `streak_days`.
- Delivery targets: Discord webhook, Notion page append, Sheets row, Zapier catch hook.

## Open Questions
- When Postgres persistence lands, determine if badge metadata should live in DB or versioned JSON.
- Confirm if leaderboard snapshots require historical backfill before Season 0 launch.
