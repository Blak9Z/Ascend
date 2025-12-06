import crypto from "node:crypto";

import type { AdapterResult, QubicEvent } from "./types";

export class QubicEventAdapter {
  private readonly namespace: string;

  constructor(namespace = "qubic") {
    this.namespace = namespace;
  }

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
    clone.type = undefined;
    return clone;
  }
}

export type { AdapterResult, QubicEvent } from "./types";
