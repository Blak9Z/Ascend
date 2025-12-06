# Technical Backlog - Milestone 5

| ID | Title | Description | Owner | Dependencies | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- |
| M5-01 | Admin Panel Scaffold | Build Next.js admin routes with Better Auth RBAC, quest list/detail views, and action logs. | @nouslabs | apps/web infra, reward ledger | Panel lists quests with sorting + inline status; RBAC prevents non-admin access; actions logged. |
| M5-02 | Quest CRUD & Overrides | Implement create/update quest forms, manual completion toggles, and XP/badge adjustments. | @nouslabs | M5-01, quest engine contracts | Form validations, optimistic updates via ORPC, manual override writes to ledger + audit trail. |
| M5-03 | Notification Pipelines | Wire Discord/Notion/Sheets/Zapier webhooks using shared template engine + retry policies. | @nouslabs | M4 reward ledger, docs/milestone-4/notifications.md | Replay CLI succeeds against mock endpoints; retries/backoff configurable; secrets pulled from env. |
| M5-04 | Observability Stack | Add metrics, traces, and dashboards for webhook ingest, adapter, reward worker, and notifications. | @nouslabs | Prior milestones, telemetry stack | Grafana dashboard JSON committed; alert rules documented; `bun test` includes telemetry smoke tests. |
| M5-05 | Launch Runbook & Checklist | Document final deployment steps, owner roster, and rollback plan for beta go-live. | @nouslabs | All previous milestones | Runbook includes preflight checklist, comms plan, support rotation, and QA sign-off. |
| M5-06 | Status Updates & Docs | Maintain implementation log + planning references throughout milestone. | @nouslabs | ongoing | `docs/milestone-5/implementation-status.md` updated weekly; planning artifacts referenced. |

## Notes
- Need GitHub billing/CI unblocked to run release workflows from milestone 2/4 before launch.
- Admin panel can start with mock data sourced from quest engine + reward feed until APIs finalize.
