import { describe, expect, test } from "bun:test";

import chainActions from "./fixtures-chain-actions.json";

describe("sample chain actions", () => {
  test("payloads include quest id and wallet", () => {
    for (const entry of chainActions) {
      expect(entry.chainAction.questId).toBe(entry.rawEvent.questId);
      expect(entry.chainAction.wallet).toBe(entry.rawEvent.wallet);
    }
  });
});
