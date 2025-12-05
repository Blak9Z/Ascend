export type QubicEventType = "QuestProgressed" | "XPAwarded" | "BadgeMinted";

export interface QubicEventBase {
  type: QubicEventType;
  questId: string;
  wallet: string;
  timestamp: number;
}

export interface QuestProgressedEvent extends QubicEventBase {
  type: "QuestProgressed";
  status: 0 | 1 | 2;
  actionHash: string;
}

export interface XPAwardedEvent extends QubicEventBase {
  type: "XPAwarded";
  amount: number;
  multiplier: number;
}

export interface BadgeMintedEvent extends QubicEventBase {
  type: "BadgeMinted";
  badgeId: string;
}

export type QubicEvent = QuestProgressedEvent | XPAwardedEvent | BadgeMintedEvent;

export interface ChainAction {
  id: string;
  wallet: string;
  questId: string;
  actionType: string;
  payload: Record<string, unknown>;
  timestamp: number;
}

export interface AdapterResult {
  chainAction: ChainAction;
  rawEvent: QubicEvent;
}
