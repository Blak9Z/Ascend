# Reward Notification Payloads - Milestone 4

## Overview
Every reward ledger insertion should fan out to Discord, Notion, Sheets, and Zapier. Until real webhooks ship, we rely on this spec + sample payloads.

## Common Payload Shape
```json
{
  "id": "ledger-004",
  "wallet": "0xabc",
  "handle": "@nouslabs",
  "questTitle": "Complete cross-category mastery sweep",
  "xpDelta": 250,
  "badge": "Legendary Ember",
  "streakDays": 9,
  "issuedAt": "2025-12-06T02:21:00Z",
  "links": {
    "dashboard": "https://ascend.quest/users/0xabc",
    "quest": "https://ascend.quest/quests/mastery-sweep"
  }
}
```

## Channel Templates

### Discord
- Rendered as embed with fields:
  - Title: `🎖️ {handle} completed {questTitle}`
  - Description: `+{xpDelta} XP · {badge ?? "XP Boost Only"}`
  - Fields: `Wallet`, `Streak`, `Links`.
- Deduplicate using ledger ID; include `footer` with issued timestamp.

### Notion
- Append to “Reward Ledger” database with columns:
  - `Quest` (title)
  - `XP Delta` (number)
  - `Badge` (select)
  - `Wallet` (rich text)
  - `Issued At` (date)
  - `Streak Days` (number)

### Sheets
- Append row: `[issuedAt, wallet, handle, questTitle, xpDelta, badge ?? "", streakDays]`.
- Google Apps Script handles formatting for XP totals.

### Zapier
- Catch hook receives the common payload.
- Sample zaps:
  1. Post to partner CRM if XP > 200.
  2. Trigger celebratory tweet via Buffer integration.

## Replay CLI
`bun run rewards:notify --fixture docs/milestone-4/samples/reward-event.json`

Steps:
1. Load JSON payload.
2. Send to each configured channel (mock HTTP adapters until secrets configured).
3. Log status codes + retry instructions.

## Observability
- Expose metrics:
  - `reward_notification_sent_total{channel=discord}`.
  - `reward_notification_failures_total`.
- Alert if failures >5 in 5m window.
