# Milestone 4 - Rewards, Badges & Leaderboard

## Objectives
- Finalize the player-facing reward loop so quests issue XP, mint badges, and fan out updates to downstream systems (Discord, leaderboard, etc.).
- Harden badge metadata, minting hooks, and ledger storage so operators can audit historical payouts.
- Ensure leaderboard views (web + API) automatically reflect XP deltas and tie-breaker logic without manual refresh.

## Workstreams
1. **Reward Service & Ledger**
   - Implement the Reward System worker that ingests quest completion events, deduplicates them, and records XP/badge state.
   - Define ledger tables for rewards, badge issuances, and XP deltas with migration + ORPC exposure.
2. **Badge Registry & On-Chain Hooks**
   - Ship metadata registry (name, rarity, CID) plus Qubic contract entrypoints that anchor badge ownership.
   - Document minting flows + failure handling shared with the contract team.
3. **Leaderboard Engine**
   - Build aggregation jobs for weekly/seasonal ladders, tie-breaker logic (XP > completion time > streak), and snapshot APIs.
   - Update apps/web dashboard to display live XP deltas, reward feed, and shareable summaries.
4. **Notifications & Webhooks**
   - Emit reward notifications to Discord/Notion/Zapier with consistent payload schema.
   - Provide sample payloads + test harness similar to Milestone 2 replay tooling.

## Deliverables
- Reward service design + implementation notes with XP/badge ledger schema.
- Badge metadata registry + Qubic hook spec.
- Leaderboard aggregation plan + dashboard updates that surface reward events inline.
- Implementation/backlog docs under `docs/milestone-4/*` that track progress, blockers, and artifacts.
