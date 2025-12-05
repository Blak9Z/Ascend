import crypto from "node:crypto";

import type { AdapterResult, QubicEvent } from "./types";

export class QubicEventAdapter {
  constructor(private readonly namespace = "qubic") {}

  normalize(event: QubicEvent): AdapterResult {
    const actionType = `${this.namespace}.${event.type}`;
    const actionId = this.determineId(event);

    return {
      rawEvent: event,
      chainAction: {
        id: actionId,
        wallet: event.wallet,
        questId: event.questId,
        actionType,
        timestamp: event.timestamp,
        payload: this.stripInternalFields(event),
      },
    };
  }

  private determineId(event: QubicEvent) {
    const base = `${event.type}:${event.questId}:${event.wallet}:${event.timestamp}`;
    return crypto.createHash("sha256").update(base).digest("hex");
  }

  private stripInternalFields(event: QubicEvent) {
    const clone = { ...event } as Record<string, unknown>;
    delete clone.type;
    return clone;
  }
}

export type { QubicEvent, AdapterResult } from "./types";
