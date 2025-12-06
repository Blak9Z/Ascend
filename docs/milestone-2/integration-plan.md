# Milestone 2 – Qubic Integration & Contract Foundations

## Objectives
- Deploy the initial Qubic contract suite plus EasyConnect adapters so chain events reach Ascend services with deterministic schemas.
- Validate bidirectional communication between the C++ contracts, the @nouslabs integration library, and the webhook receiver.
- Establish CI/CD workflows (build, test, deploy) for smart contracts and adapters.

## Workstreams
1. **Contract Bring-Up**
   - Scaffold `contracts/qubic` with toolchains (clang, cmake, conan) and template tests.
   - Implement quest progress ledger, XP allocator, and badge minter as defined in milestone 1 spec.
   - Provide deployment scripts for localnet + integration environments.
2. **EasyConnect Adapter**
   - Extend the @nouslabs library to normalize `QuestProgressed`, `XPAwarded`, and `BadgeMinted` events.
   - Publish TypeScript bindings for apps/web to consume.
3. **On-chain Schema Sync**
   - Align SQLite/Postgres tables with on-chain IDs; create data mapping docs.
4. **CI/CD & Observability**
   - Set up GitHub Actions for contract compilation/tests.
   - Add tracing/logging for adapter runs and webhook ingestion metrics.

## Deliverables
- Contract repo with README, build scripts, and deterministic tests.
- Adapter package published under internal registry (npm scope `@nouslabs`).
- Sample EasyConnect payloads recorded from localnet for replay.
- Runbooks for deployment, key rotation, and incident response.

