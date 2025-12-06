export type MilestoneStatus = "complete" | "in_progress" | "blocked";

export type MilestoneSummary = {
  id: string;
  title: string;
  timeframe: string;
  status: MilestoneStatus;
  owner: string;
  progress: number;
  description: string;
  highlights: string[];
  deliverables: string[];
  nextUp: string[];
  blockers?: string[];
};

export const milestoneSummaries: MilestoneSummary[] = [
  {
    id: "m1",
    title: "Milestone 1 · Product & Technical Blueprint",
    timeframe: "Week 1-2",
    status: "complete",
    owner: "@nouslabs",
    progress: 100,
    description:
      "Locked the quest catalog, XP economy, and the initial qubic contract requirements so downstream workstreams could execute in parallel.",
    highlights: [
      "Interviewed stakeholders to rank the flagship onboarding, learning, and competition quests.",
      "Captured full system architecture diagrams that map EasyConnect signals through Ascent services.",
      "Documented qubic contract storage, entrypoints, and event payloads aligned with the in-house integration library.",
    ],
    deliverables: [
      "docs/milestone-1/product-brief.md - quest catalog, badge tiers, XP rules.",
      "docs/milestone-1/system-architecture.md - component flows plus sequence narrative.",
      "docs/milestone-1/qubic-contract-spec.md - contract storage + events.",
      "docs/milestone-1/technical-backlog.md - INVEST stories with owners.",
    ],
    nextUp: [
      "Feed blueprint learnings into contract scaffolding and adapters in Milestone 2.",
    ],
  },
  {
    id: "m2",
    title: "Milestone 2 · Qubic Integration & Adapter",
    timeframe: "Week 3-4",
    status: "complete",
    owner: "@nouslabs",
    progress: 100,
    description:
      "Delivered the first contract slice, EasyConnect adapter, and CI hooks so we can move normalized chain actions into Ascent environments.",
    highlights: [
      "Stood up the qubic contract workspace with scripts, formatting, and deterministic tests.",
      "Shipped the EasyConnect adapter package plus replay harness for fixture-driven debugging.",
      "Added GitHub workflows for contract builds and adapter publishes, pending billing unlock to run in the cloud.",
    ],
    deliverables: [
      "docs/milestone-2/integration-plan.md - workstreams + responsibilities.",
      "docs/milestone-2/contract-roadmap.md - sprint-by-sprint qubic scope.",
      "docs/milestone-2/technical-backlog.md - issues M2-01 through M2-08.",
      "docs/milestone-2/localnet-readme.md - process to capture/publish fixtures.",
    ],
    nextUp: [
      "Unblock GitHub billing so adapter-publish and contract-artifacts workflows can run.",
      "Pipe replay harness data directly into the quest engine for milestone 3 validation.",
    ],
    blockers: [
      "GitHub Actions release jobs paused until billing issue on the org is resolved.",
    ],
  },
  {
    id: "m3",
    title: "Milestone 3 · Quest Evaluation Engine",
    timeframe: "Week 5-6",
    status: "in_progress",
    owner: "@nouslabs",
    progress: 65,
    description:
      "Bringing the quest evaluation engine online with a rule DSL, replay fixtures, and deterministic tests before wiring Postgres + ORPC.",
    highlights: [
      "Created packages/quest-engine with Bun build/test scripts and published types.",
      "Documented the rule DSL and sample rule catalog in docs/milestone-3/rule-dsl.md.",
      "Implemented in-memory persistence plus Bun tests that replay sample EasyConnect payloads.",
    ],
    deliverables: [
      "docs/milestone-3/integration-plan.md - objectives for evaluation engine.",
      "docs/milestone-3/technical-backlog.md - issues M3-01 through M3-06.",
      "docs/milestone-3/samples/*.json - rule catalog and replay actions.",
      "packages/quest-engine - source package for DSL + evaluation engine.",
    ],
    nextUp: [
      "Design Postgres persistence schema and ORPC surface for quest snapshots.",
      "Replay real ChainAction logs once adapters provide data, updating fixtures/tests.",
      "Expose evaluation summaries to apps/web dashboards for live quest boards.",
    ],
    blockers: [
      "Awaiting production payloads and credentials before wiring external persistence.",
    ],
  },
];
