# System Architecture – Milestone 1 Blueprint

## Component Overview
- **EasyConnect Webhook Receiver** – HTTP ingest service that receives signed payloads from EasyConnect and normalizes them into `ChainAction` events.
- **Quest Evaluation Engine** – Stateless worker/service that evaluates `ChainAction` events against quest rule templates and emits `QuestProgress` events.
- **Reward System** – Consumes `QuestProgress` to allocate XP, mint badges (via Qubic), and emit user-facing notifications.
- **Leaderboard Engine** – Aggregates XP deltas and quest completions into season snapshots stored in Postgres + Redis cache.
- **Notifications System** – Listens to reward/quest events and dispatches to Discord, Notion, Sheets, Zapier webhooks using templates.
- **Admin Panel** – CRUD and analytics interface for quests, rewards, and manual intervention.

## Data Contracts
```
ChainAction {
  id: string            // hash of tx + log index
  wallet: string        // Qubic wallet address
  actionType: string    // e.g., identity.verified, quest.submission
  payload: object       // normalized fields from qubic transaction
  timestamp: string
}

QuestProgress {
  id: string            // deterministic wallet + questId + timestamp
  questId: string
  wallet: string
  status: "started" | "completed"
  evidence: object      // pointers to ChainAction ids
  issuedAt: string
}

RewardEvent {
  wallet: string
  questId: string
  xpAwarded: number
  badgeId?: string
  source: "quest" | "manual"
  metadata: object
}
```

## Flow Narrative
1. EasyConnect Webhook Receiver validates HMAC signatures using the in-house Qubic library, persists raw payloads, and publishes `ChainAction` events to Kafka (or Bun worker queue).
2. Quest Evaluation Engine subscribes to `ChainAction`, loads quest rule templates (YAML) from config store, and calculates progress/completion. Idempotence via composite key `(wallet, questId, actionId)`.
3. Completed quests trigger Reward System to compute XP/badge outcomes. Badges requiring on-chain proof call Qubic contracts via the same C++ library.
4. Reward outcomes update Leaderboard aggregates and the Postgres `quest_progress` tables. A cache layer exposes leaderboard data to the web app.
5. Notifications System consumes Reward events to send Discord/Notion/Sheets/Zapier messages with templated payloads.
6. Admin Panel surfaces metrics by querying Postgres and calling internal APIs (Quest Engine admin endpoints, Reward service overrides).

## Deployment Topology (Milestone 1)
- Webhook Receiver + Quest Engine + Reward System deployed as Bun/Node services behind a shared API gateway.
- Kafka (or in-memory queue if infra limited) for decoupling ingestion/evaluation.
- Postgres for quest state, XP logs, leaderboard snapshots.
- Redis for caching leaderboard reads and rate-limiting notifications.
- Monitoring via OpenTelemetry traces exported to chosen backend; dashboards track webhook latency and evaluation throughput.

## Sequence Diagram (textual)
```
EasyConnect -> Webhook Receiver: POST /chain-events (signed)
Webhook Receiver -> Queue: publish ChainAction
Queue -> Quest Engine: deliver ChainAction
Quest Engine -> Postgres: upsert quest_progress (started/completed)
Quest Engine -> Reward System: emit QuestProgress event
Reward System -> Qubic Contracts: mint badge / write XP state
Reward System -> Leaderboard Engine: update XP totals
Reward System -> Notifications: emit RewardEvent
Notifications -> Discord/Notion/Sheets/Zapier: send templated payload
Admin Panel -> Postgres/APIs: read quest + reward data
```

## Open Questions
- Final queueing tech (Kafka vs Bun workers) pending infra decision.
- Should badge metadata live purely off-chain or mirrored on-chain for verification? In this milestone we assume registry off-chain but minted badges anchor on-chain.
- Determine how to store diagram assets (Mermaid vs external). Currently textual description suffices.
