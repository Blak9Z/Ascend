# Qubic Contracts

Ascend's milestone-2 contract suite is implemented in C++ and targets the Qubic runtime. This repo provides tooling to build, test, and deploy the quest ledger, XP allocator, and badge minter contracts.

## Project structure

```
contracts/qubic/
+-- CMakeLists.txt           # project + testing targets
+-- conanfile.txt            # dependency pinning (Catch2, fmt)
+-- src/
¦   +-- ledger.hpp           # quest progress + reward structs
¦   +-- ledger.cpp           # contract entrypoints + helpers
¦   +-- badge_minter.cpp     # placeholder for mint logic
+-- tests/
¦   +-- ledger_test.cpp      # deterministic tests using Catch2
+-- scripts/
    +-- localnet.sh          # helper for local deployment stubs
```

## Tooling

- **Compiler:** clang++ 17+
- **Build:** CMake 3.26+
- **Deps:** Managed via Conan (Catch2 for tests, fmt for logging)

Install dependencies and build:

```bash
cd contracts/qubic
conan install . --output-folder=build --build=missing
cmake -S . -B build -DCMAKE_BUILD_TYPE=Debug
cmake --build build
ctest --test-dir build
```

## Next steps

- Flesh out ledger + badge mint logic according to `docs/milestone-1/qubic-contract-spec.md`.
- Add deployment scripts that push compiled WASM to Qubic localnet nodes.
- Wire CI to run `cmake --build` + `ctest` on every PR.

