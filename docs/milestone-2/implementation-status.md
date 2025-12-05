# Milestone 2 - Implementation Status

## Current focus
- Contract skeletons now live in `contracts/qubic` with CMake + Conan scaffolding, ledger logic/tests, and CI coverage.
- EasyConnect adapter package at `packages/easyconnect-adapter` can normalize recorded payloads via the replay script.

## Completed
- ? Repo scaffolding for quest ledger + badge minter with C++23 logic (status enforcement, XP caps, badge registry) and Catch2 tests.
- ? Local deployment script stub plus documentation for build/test workflow.
- ? TypeScript adapter package with normalization utilities and build/lint/test scripts.
- ? GitHub Actions workflow (`.github/workflows/contracts.yml`) builds/tests contracts on push & PR.
- ? Sample replay harness storing normalized payloads + Bun test (`apps/web/tests/chain-actions.test.ts`) to guard adapter output.

## Next up
1. Build/publish adapter + contract artifacts via CI or internal registry (capture steps once infra is ready).
2. Integrate replay coverage with ORPC tests/dashboards using the generated fixtures.
