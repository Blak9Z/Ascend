# Technical Backlog - Milestone 1

| ID | Title | Description | Owner | Dependencies | Acceptance Criteria |
| --- | --- | --- | --- | --- | --- |
| M1-01 | Dashboard IA & Wireframes | Produce wallet onboarding + quest dashboard wireframes in Figma and export snapshots for dev handoff. | @nouslabs | Persona + quest catalog insights | Review sign-off from product + design; wireframes linked inside repo + matches product brief personas. |
| M1-02 | Quest List & Detail UX Copy | Draft quest card microcopy, completion states, and badge/XP messaging for the web app. | @nouslabs | M1-01 wireframes | Content doc reviewed by marketing; quest states (locked, in-progress, complete) documented for frontend. |
| M1-03 | apps/web Quest Components Skeleton | Build placeholder React components (`QuestList`, `QuestCard`, `QuestDetail`) with mocked data + Storybook or page preview. | @nouslabs | M1-01/02 assets | Components render sample quests, support loading/error/empty states, and pass lint + unit snapshot tests. |
| M1-04 | Leaderboard View Prototype | Implement leaderboard table + filters on `/leaderboard` route using mocked XP data. | @nouslabs | Quest component skeleton | Sorting + pagination work locally with Tailwind styles and matches leaderboard rules from product brief. |
| M1-05 | Notifications + Profile Panel | Add UI scaffold for Discord/Notion/Sheets connections and profile badge showcase within apps/web. | @nouslabs | Quest components to reuse tokens | Panel toggles channels, persists mocked state, and includes responsive layout + accessibility audit checklist. |
| M1-06 | Backlog Grooming & Acceptance Criteria | Convert roadmap + UX tasks into GitHub issues with INVEST criteria and assign owners. | @nouslabs | Output from M1-01 to M1-05 | Issues exist in tracker, cross-link to docs + wireframes, and include definition of done referencing web components. |
| M1-07 | Stakeholder Web Review | Demo UI scaffolds to product/eng, capture feedback, and create follow-up tickets. | @nouslabs | Completion of UI prototypes | Meeting notes archived in repo; action items filed; approval to proceed to data integration recorded. |
| M1-08 | Qubic Contract Skeleton | Scaffold contracts/qubic repo with build/test/deploy scripts; ensure docs highlight how UI will consume contract data later. | @nouslabs | UI backlog approved | CI builds passing; localnet deployment instructions verified; README maps events to frontend needs. |
| M1-09 | Event Normalization Adapter | Extend in-house library to decode Qubic events and emit ChainAction JSON once contract proofs ready. | @nouslabs | M1-08 ABI | Adapter passes replayed payload tests and exposes typed SDK for apps/web consumption. |

## Notes
- Backlog ordered to unblock the web app experience first; blockchain integration trails once UI scaffolds + copy are approved.
- Tag @nouslabs on every issue/PR to keep milestone ownership visible; include links to Figma/file artifacts for web tasks and contract repos for the final items.
