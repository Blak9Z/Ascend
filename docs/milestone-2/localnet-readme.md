# Localnet Payload Capture

Even without access to production Qubic nodes, we can simulate the capture flow so the replay harness and downstream teams know what to expect. When localnet access is granted, run:

```bash
./scripts/localnet.sh deploy           # deploy compiled WASM contracts
qubic-cli send quest-progress ...      # fictional CLI call to trigger events
qubic-cli logs --filter quest          # stream structured logs
```

Save payloads as JSON lines in `docs/milestone-2/samples/qubic-events.json`. Then execute:

```bash
cd packages/easyconnect-adapter
bun run replay --input ../../docs/milestone-2/samples/qubic-events.json --output ../../docs/milestone-2/samples/chain-actions.json
```

The resulting `chain-actions.json` feeds the Bun tests (`apps/web/tests/chain-actions.test.ts`) and the UI replays. Once real payloads replace the fictional ones, rerun `bun run replay` and commit the updated fixtures.
