# Milestone 2 – Contract & Adapter Roadmap

## Timeline
| Week | Focus | Outcomes |
| --- | --- | --- |
| 3 | Tooling + Skeletons | Repo scaffolding, CI pipeline, stub handlers. |
| 4 | Feature Complete + Adapter Integration | Ledger logic implemented, adapter normalizes events, localnet demo recorded. |

## Contract Tasks
1. **Repository Scaffold**
   - Create `contracts/qubic` with modules for quest ledger, rewards, badge registry.
   - Add formatting/lint scripts and pre-commit hooks.
2. **Quest Progress Ledger**
   - Implement `record_progress` with dedupe and replay protection.
   - Emit `QuestProgressed` with action hashes.
3. **XP Allocator**
   - Guard daily caps (500 XP) and apply multipliers; emit `XPAwarded`.
4. **Badge Minter**
   - Support non-repeatable + repeatable badges; verify metadata CID integrity.
5. **Admin Functions**
   - Manage badge registry entries and orchestrator/address roles with multisig.

## Adapter Tasks
- Extend @nouslabs C++/TS bridge to subscribe to Qubic logs and serialize them to EasyConnect payloads.
- Implement retries and dead-letter queue for malformed events.
- Provide CLI to replay contract logs for testing.

## Testing Strategy
- Unit tests per contract module using deterministic fixtures.
- Integration tests spinning up localnet, executing sample quests, and checking event stream.
- Contract fuzzing for quest status transitions.
- Adapter e2e tests feeding events into the webhook receiver.

## Deployment Runbook
1. Build contracts via CI, upload artifacts.
2. Run `deploy:localnet` and `deploy:staging` scripts with parameter overrides.
3. Update adapter config with contract addresses + keys.
4. Broadcast test quests, validate events in Ascent playground UI.
5. Record snapshots and archive logs in Notion/Drive.
