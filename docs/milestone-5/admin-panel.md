# Admin Panel Blueprint (Milestone 5)

## User Roles
- **Operator**: create/edit quests, view reward ledger, trigger manual overrides.
- **Reviewer**: read-only access, can comment/flag but not mutate data.
- **Observer**: limited dashboard view (leaderboard, notifications) for partner demos.

## Screens
1. **Quest Catalog**
   - Table columns: Quest title, category, status, XP, badge, updatedAt.
   - Filters: category, status, badge, owner.
   - Bulk actions: publish/unpublish, assign owner, duplicate quest.
2. **Quest Detail**
   - Tabs: Overview, Rules, Rewards, Activity, Overrides.
   - Activity tab streams reward ledger + notification history for that quest.
3. **Manual Override**
   - Form to toggle completion, adjust XP/badge, append notes.
   - Requires justification + secondary approval (two-man rule) for badge revokes.
4. **Notifications Console**
   - Shows per-channel delivery state, retries, and payload preview (JSON).
   - Actions: replay payload, mute channel, edit template reference.

## Architecture
- Admin routes live under `apps/web/src/app/(admin)`.
- Auth guard uses Better Auth session scopes (`admin`, `reviewer`, `observer`).
- Data fetched via ORPC:
  - `quests.list`, `quests.update`, `rewards.override`, `notifications.replay`.
- UI uses same component primitives (cards, tables) with shadcn + custom wrappers for diffed styling.

## Audit Logging
- Every mutation writes to `audit_events` table (id, actorId, action, resource, payload, createdAt).
- Logs appear inline in admin UI + forwarded to Notion for compliance export.

## Mock Data Strategy
- Until APIs ready, feed admin UI from existing quest engine + reward ledger fixtures (Milestone 3/4).
- Provide toggle to switch between `mock` and `live` data via env var or dev toolbar.
