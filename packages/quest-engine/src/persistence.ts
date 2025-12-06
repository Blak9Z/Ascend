import type { QuestProgressRecord } from "./types";

export type ProgressStore = {
  upsert(record: QuestProgressRecord): QuestProgressRecord;
  get(questId: string, wallet: string): QuestProgressRecord | undefined;
};

export class InMemoryProgressStore implements ProgressStore {
  private readonly store = new Map<string, QuestProgressRecord>();

  private key(questId: string, wallet: string) {
    return `${questId}:${wallet}`;
  }

  upsert(record: QuestProgressRecord): QuestProgressRecord {
    this.store.set(this.key(record.questId, record.wallet), record);
    return record;
  }

  get(questId: string, wallet: string) {
    return this.store.get(this.key(questId, wallet));
  }
}
