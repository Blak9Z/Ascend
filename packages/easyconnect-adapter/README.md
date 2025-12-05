# @nouslabs/easyconnect-adapter

This package ingests raw Qubic contract events and emits normalized EasyConnect payloads that Ascent services understand. It is intentionally framework-agnostic and can run in workers, lambdas, or long-running bun/Node services.

## Usage

```ts
import { QubicEventAdapter } from "@nouslabs/easyconnect-adapter";

const adapter = new QubicEventAdapter();
const payload = adapter.normalize({
  type: "QuestProgressed",
  questId: "connect-profile",
  wallet: "0xabc",
  status: 2,
  actionHash: "0x1",
  timestamp: Date.now(),
});

console.log(payload.chainAction);
```

## Scripts

- `bun run build` - bundle to `dist/` via tsup
- `bun run lint` - Biome check for this package
- `bun run test` - placeholder for future unit tests
- `bun run replay` - normalize sample Qubic events from `docs/milestone-2/samples`

## Next steps

- Implement adapters for real Qubic log payloads via the @nouslabs SDK.
- Add integration tests that replay recorded logs (see `bun run replay` output).
- Publish to the internal npm registry once contracts emit live events.
