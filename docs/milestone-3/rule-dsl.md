# Quest Rule DSL

Rules are defined as JSON objects validated by Zod. Each rule describes how to convert normalized chain actions into quest progress/completion events.

```json
{
  "id": "rule-connect-profile",
  "questId": "connect-profile",
  "description": "Complete onboarding by verifying wallet + profile",
  "conditions": [
    { "field": "actionType", "operator": "equals", "value": "qubic.QuestProgressed" },
    { "field": "payload.status", "operator": "gte", "value": 1 }
  ],
  "completion": {
    "type": "eventCount",
    "threshold": 1
  },
  "rewards": {
    "xp": 50,
    "badgeId": "starter-spark"
  }
}
```

- `conditions` are evaluated against each ChainAction.
- `completion.type` supports `eventCount` and `fieldMatch` in the initial iteration.
- `rewards` metadata is emitted alongside completion events for downstream services.

Sample catalogs live in `docs/milestone-3/samples/rules.json`.
