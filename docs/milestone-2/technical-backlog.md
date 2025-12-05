# Technical Backlog – Milestone 2

| ID | Title | Description | Owner | Dependencies | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- |
| M2-01 | Contract Repo Bootstrap | Create `contracts/qubic` repo, add build/test scripts, and CI pipeline. | @nouslabs | Milestone 1 docs | CI job compiles + runs sample test; README explains setup. |
| M2-02 | Quest Ledger Implementation | Code `record_progress` with dedupe + events plus unit tests. | @nouslabs | M2-01 | Tests cover upgrade/dedupe paths; emits event with hashes. |
| M2-03 | XP Allocation Engine | Implement `allocate_xp` caps/multipliers and tie into ledger. | @nouslabs | M2-02 | Unit tests enforce 500 XP/day policy; events consumed by adapter replay. |
| M2-04 | Badge Mint Module | Add `mint_badge` with registry + repeat rule enforcement. | @nouslabs | M2-01 | Metadata validation + event emission verified via tests. |
| M2-05 | Adapter Event Normalization | Extend library to convert contract logs to EasyConnect payloads with retries. | @nouslabs | M2-02/M2-04 | Replay CLI outputs JSON payloads consumed by webhook receiver. |
| M2-06 | Localnet Replay Harness | Script to deploy contracts, execute sample quests, and record payloads. | @nouslabs | M2-02 to M2-05 | Files archived under `docs/milestone-2/samples`, used in automated integration tests. |
| M2-07 | CI/CD + Key Rotation Runbook | Document deployment flow + key rotation plus create GH Actions release pipeline. | @nouslabs | M2-01, M2-05 | Runbook reviewed by ops; pipeline can sign + publish artifacts. |
| M2-08 | Webhook Adapter Wiring | Connect adapter output to `apps/web` via ORPC endpoints and mocked queries. | @nouslabs | M2-05 | Dashboard shows live data from replay harness; e2e test passes. |

## Notes
- Owners default to @nouslabs; assign sub-tasks to contract & adapter contributors as they join.
- Track artifacts in `docs/milestone-2/` and link issue IDs for quick navigation.
