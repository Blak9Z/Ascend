# Notifications Pipeline (Milestone 5)

## Flow
1. Reward ledger append triggers `RewardNotificationJob`.
2. Job loads template + channel config from `config/notifications/*.json`.
3. Payload rendered via Liquid + timezone formatting.
4. Delivery adapters (Discord, Notion, Sheets, Zapier) send requests with retries/backoff.
5. Results stored in `notification_deliveries` table for observability.

## Channel Config Schema
```jsonc
{
  "id": "discord",
  "webhookUrl": "https://discord.com/api/webhooks/...",
  "enabled": true,
  "template": "reward-embed.liquid",
  "maxRetries": 5,
  "backoffSeconds": [30, 60, 180, 600, 1800]
}
```

## CLI Replay
`bun run notifications:replay --channel discord --fixture docs/milestone-4/samples/reward-event.json`

Steps:
1. Load fixture + template.
2. Render preview to console (JSON + Markdown).
3. Prompt operator before sending.
4. Log response + persist to `notification_deliveries`.

## Failure Handling
- Retries use exponential backoff with jitter.
- If all retries fail, raise alert + write to `notification_dead_letter`.
- Admin panel exposes "replay" button referencing the dead-letter entry.

## Secrets & Environments
- Webhook URLs stored in `.env` per app (dev) and secret manager (staging/prod).
- Provide `turborepo` pipeline to sync secrets to Next.js edge runtime.

## Metrics
- `notifications_sent_total{channel}`
- `notifications_retry_total{channel}`
- `notifications_failure_total{channel}`
- `notifications_latency_ms_bucket{channel}`

## TODO
- Add Notion template for quest retro doc creation.
- Support templated attachments (images, badge art) once CDN ready.
