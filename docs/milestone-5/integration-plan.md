# Milestone 5 - Notifications, Admin Panel & Launch

## Objectives
- Ship the operator workflows (admin panel + overrides) required for a controlled beta.
- Wire outbound notifications (Discord, Notion, Sheets, Zapier) with templated payloads and retries.
- Stand up observability + launch checklist so contracts, adapters, and dashboards are monitored end-to-end.

## Workstreams
1. **Admin Panel & Quest Ops**
   - Implement quest CRUD, reward adjustments, and manual completion overrides.
   - Add audit logging + role-based access tied to Better Auth.
2. **Notification Pipelines**
   - Productionize Discord/Notion/Sheets/Zapier webhooks with shared template engine, retries, and Secret Manager wiring.
   - Provide replay CLI + docs to validate payloads pre-launch.
3. **Observability & SLOs**
   - Instrument webhook ingress, reward worker, quest engine, and leaderboard jobs.
   - Publish Grafana dashboards plus alert rules consumed by on-call rotation.
4. **Launch Checklist**
   - Compile contract deployment, adapter publish, quest catalog load, and partner enablement tasks.
   - Document cutover + rollback plans, ownership, and communication channels.

## Deliverables
- Admin panel spec + incremental UI shipping plan.
- Notification templates + environment rollout steps (dev → staging → prod).
- Observability dashboard links + alert catalog.
- Launch runbook referencing dependencies, owners, and timelines.
