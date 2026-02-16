import { HISTORY_ITEM_TYPES } from "../constants/history";

export type HistoryItemType = typeof HISTORY_ITEM_TYPES[keyof typeof HISTORY_ITEM_TYPES];

export interface HistoryItem {
  msg: string;
  type: HistoryItemType;
}