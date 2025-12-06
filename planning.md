# Ascend Roadmap

## Milestone 1 - Product & Technical Blueprint (Week 1-2)
Focus: validate the quest catalog, reward model, and blockchain interaction patterns before any implementation work. Document how EasyConnect events traverse Ascend.
Deliverables:
- Product brief covering target quest types, badge structure, XP economy, and leaderboard rules.
- System architecture diagram that shows EasyConnect Webhook Receiver, Quest Evaluation Engine, Reward System, Leaderboard, Notifications, and Admin Panel interactions.
- Qubic C++ contract specifications detailing required on-chain state, callable methods, and event structure, aligned with the library that will interact with the chain.
- Technical backlog with acceptance criteria for each component.
**Artifacts in progress (Milestone 1)**
- `docs/milestone-1/product-brief.md` – quest catalog + badge/XP economy outline.
- `docs/milestone-1/system-architecture.md` – component flow, data contracts, and textual sequence diagram.
- `docs/milestone-1/qubic-contract-spec.md` – storage layout, actions, and events for Qubic contracts managed by @nouslabs.
- `docs/milestone-1/technical-backlog.md` – INVEST stories with owners (default @nouslabs) and acceptance criteria.
- `docs/milestone-1/implementation-status.md` – running log of shipped UI/infra work for milestone 1 plus next steps before milestone 2.
### Issue: Blueprint Validation & Architecture Alignment
**Description**
Capture the end-to-end journey of an EasyConnect event through Ascend, align stakeholders on the quest catalog, and lock the qubic contract requirements before we touch code so downstream teams can build confidently.
**Guides**
- Interview growth, education, and partnerships to prioritize ten flagship quests, tagging each with complexity, dependencies, and success metrics.
- Host a whiteboard session to map EasyConnect -> Webhook Receiver -> Quest Engine -> Rewards -> Notifications, then translate it into a C4 or sequence diagram.
- Pair with the qubic core contributor to define contract interfaces, memory layout, and event payloads that the integration library can consume without extra parsing.
- Break the architecture into backlog items with INVEST-style acceptance criteria, linking each to the diagram and contract spec for traceability.

## Milestone 2 - Qubic Integration & Contract Foundations (Week 3-4)
Focus: stand up the blockchain layer and confirm that our C++ contracts and integration library can move data between Qubic and the Ascend services.
Deliverables:
- Initial Qubic smart contract repository with compile scripts, unit tests, and deployment notes.
- On-chain schemas for tracking quest progress, badge issuance, and XP allocations.
- EasyConnect webhook adapter that normalizes Qubic transactions into Ascend events via the in-house library.
- CI job that builds the C++ contracts and runs deterministic contract tests on every pull request.
**Artifacts (Milestone 2)**
- `docs/milestone-2/integration-plan.md` – objectives, workstreams, and deliverables for Qubic integration and adapters.
- `docs/milestone-2/contract-roadmap.md` – week-by-week breakdown of contract modules, adapter tasks, testing, and deployment runbook.
- `docs/milestone-2/technical-backlog.md` – actionable issue list (M2-01 … M2-08) with owners and acceptance criteria.
- `docs/milestone-2/implementation-status.md` – running status for contracts, adapter, CI, replay harness, and pending external steps.
- `docs/milestone-2/localnet-readme.md` – guide for capturing localnet payloads and regenerating replay fixtures once access is granted.
### Issue: Qubic Contract Bring-Up & EasyConnect Adapter
**Description**
Implement the first contract slice plus the webhook adapter so we can observe qubic transactions flowing into Ascend test environments with deterministic builds.
**Guides**
- Scaffold the contract repo with clang-format, CMake, and Conan presets; document how to build and deploy to a localnet validator node.
- Model on-chain tables for quest progress and reward claims, ensuring IDs align with wallet plus quest IDs from Ascend.
- Extend the in-house library to decode relevant qubic events, normalize timestamps, and push them into the EasyConnect webhook receiver with signature verification.
- Add GitHub Actions jobs that compile with sanitizers, execute unit tests, and publish artifacts for integration testing on each pull request.

## Milestone 3 - Quest Evaluation Engine (Week 5-6)
Focus: convert normalized chain actions into quest progress automatically and surface status in the dashboard APIs.
Deliverables:
- Stateless Quest Evaluation Engine service with rule templates for onboarding, competition, and learning quests.
- Rule authoring DSL and validation scripts so admins can compose quests without redeploying code.
- Persistence layer (likely Postgres) for quest progress snapshots keyed to wallet IDs and quest IDs.
- Integration tests that replay recorded EasyConnect payloads and confirm quests auto-complete.
### Issue: Quest Engine Rule Authoring & Replay Harness
**Description**
Deliver the stateless quest engine plus a replay harness that proves recorded EasyConnect payloads trigger the right quest completions without code redeploys.
**Guides**
- Define the DSL syntax (YAML or JSON based) with condition, reward, and cooldown blocks plus schema validation tooling.
- Implement the evaluation loop as a deterministic service that accepts normalized events, evaluates rules, and emits idempotent progress updates.
- Stand up Postgres schemas for quest states (progress, completion, timestamps) with migrations checked into the repo.
- Build a replay CLI that ingests captured payloads, replays them against staging, and exports coverage reports tying quests to sample data.
**Artifacts (Milestone 3)**
- `docs/milestone-3/integration-plan.md` – objectives + workstreams for the quest evaluation engine.
- `docs/milestone-3/technical-backlog.md` – issue list (M3-01 …).
- `docs/milestone-3/rule-dsl.md` + `samples/` – DSL spec and sample rule catalog/fixtures.
- `docs/milestone-3/implementation-status.md` – running status updates.
- `packages/quest-engine` – source package for the evaluation engine and DSL tooling.

## Milestone 4 - Rewards, Badges, and Leaderboard (Week 7-8)
Focus: finalize the player-facing outcomes for completed quests and ensure everything syncs to the public leaderboard.
Deliverables:
- Reward System microservice that mints badges, increments XP, and emits events for downstream systems.
- Badge metadata registry plus the Qubic-side minting hooks to prove ownership on-chain.
- Leaderboard engine with season settings, tie-breaker logic, and API endpoints for the user dashboard.
- End-to-end test suite that asserts completing a quest updates XP, badges, and leaderboard entries within SLA.
### Issue: Reward Loop Hardening & Leaderboard Consistency
**Description**
Ensure reward issuance, badge minting, and leaderboard snapshots stay in sync even under concurrent quest completions.
**Guides**
- Implement the reward service as an event-driven worker with deduplication keys to avoid double-minting badges.
- Design badge metadata (name, rarity, art CID) and wire the qubic contract hook that anchors badge ownership on-chain.
- Build leaderboard aggregation jobs with season rollover commands that support tie-breaker rules such as XP, completion time, or streaks.
- Author end-to-end tests that trigger quest completion via mocked EasyConnect events and assert XP, badge, and leaderboard states update within SLA.
**Artifacts (Milestone 4)**
- `docs/milestone-4/integration-plan.md` – reward, badge, leaderboard objectives/workstreams.
- `docs/milestone-4/technical-backlog.md` – M4 issue list with owners + acceptance criteria.
- `docs/milestone-4/reward-loop.md` – reward worker data contracts + API surface.
- `docs/milestone-4/badge-registry.md` – canonical badge metadata schema + sample entries.
- `docs/milestone-4/leaderboard-plan.md` – aggregation workflow, ranking rules, and APIs.
- `docs/milestone-4/notifications.md` – outbound payload specs + replay CLI references.
- `docs/milestone-4/implementation-status.md` – rolling updates/blockers for milestone 4.
- `docs/milestone-4/samples/` – example reward event + leaderboard snapshot fixtures.

## Milestone 5 - Notifications, Admin Panel & Launch (Week 9-10)
Focus: polish the operator and user experiences, wire up comms, and ship to early partners.
Deliverables:
- Notification pipelines for Discord, Notion, Sheets, and Zapier with templated payloads and retry policies.
- Admin Panel flows for creating quests, adjusting rewards, and manually resolving edge cases.
- Observability stack (dashboards plus alerts) covering webhook latency, contract execution, and evaluation throughput.
- Beta launch checklist including contract deployment, quest catalog load, documentation, and customer onboarding sessions.
### Issue: Ops Readiness, Notifications & Beta Launch
**Description**
Finalize operator tooling, outbound notifications, and the launch process so partners can run quests end to end with confidence.
**Guides**
- Build notification templates with Liquid or Handlebars, mapping quest events to Discord webhooks, Notion pages, Sheets append actions, and Zapier workflows.
- Implement admin panel permissions, quest CRUD flows, and manual override tools for stuck quests or reward disputes.
- Configure Grafana or Prometheus dashboards plus alert rules covering webhook ingestion, contract execution time, and quest evaluation lag.
- Draft and execute the beta checklist: deploy contracts, seed the quest catalog, onboard first partners, and run a go or no-go review with stakeholders.
**Artifacts (Milestone 5)**
- `docs/milestone-5/integration-plan.md` – admin panel, notifications, launch readiness objectives.
- `docs/milestone-5/technical-backlog.md` – issue list with owners + acceptance criteria.
- `docs/milestone-5/admin-panel.md` – operator UX blueprint & RBAC requirements.
- `docs/milestone-5/notifications-pipeline.md` – delivery flow, schema, replay CLI.
- `docs/milestone-5/launch-checklist.md` – beta go-live runbook.
- `docs/milestone-5/implementation-status.md` – progress log + blockers.
