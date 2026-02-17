import { HISTORY_ITEM_TYPES } from "./constants";

export type HistoryItemType = typeof HISTORY_ITEM_TYPES[keyof typeof HISTORY_ITEM_TYPES];

export interface HistoryItem {
  message: string;
  type: HistoryItemType;
}