# Beta Launch Checklist (Milestone 5)

## Preflight
- [ ] Contracts: deploy Qubic contracts to target shard, verify storage layout vs. docs/milestone-1/qubic-contract-spec.md.
- [ ] Adapter: publish EasyConnect adapter package + configure webhook URL/secrets.
- [ ] Quest Catalog: load finalized rules + rewards into quest engine (prod DB).
- [ ] Notification Secrets: populate Discord/Notion/Sheets/Zapier credentials in Secret Manager.
- [ ] Observability: dashboards live + alerts routed to on-call channel.

## Dry Run
- [ ] Replay sample payloads (docs/milestone-4/samples/reward-event.json) against staging.
- [ ] Verify reward ledger entries, notifications, and leaderboard snapshots update within SLA.
- [ ] Run admin panel overrides on staging (complete quest, adjust XP, revert).
- [ ] Execute rollback drill (disable notifications, revert quest state).

## Go / No-Go
- [ ] Hold go/no-go meeting with @nouslabs + partner stakeholders.
- [ ] Confirm GitHub billing / CI status (release workflows green).
- [ ] Announce freeze window + communication channels.

## Launch Day
- [ ] Enable production webhooks + adapters.
- [ ] Monitor dashboards (webhook latency, reward worker, notifications).
- [ ] Provide live updates in ops channel every 30 min for first 4 hours.

## Post Launch
- [ ] Collect feedback from partners, log issues.
- [ ] Run retro capturing successes, blockers, action items for Milestone 6.
- [ ] Archive launch artifacts (dashboards, logs, checklists) for compliance.
