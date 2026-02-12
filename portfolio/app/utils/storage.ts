import { HistoryItem } from "@app/types/history";

interface RecordStore {
  set: (value: any) => void;
  getRecords: () => HistoryItem[] | null;
}

class RecordStorage implements RecordStore {
  private readonly key: string = "portfolio-storage";

  set(value: any): void {
    localStorage.setItem(this.key, JSON.stringify(value));
  }

  getRecords(): HistoryItem[] | null {
    const data = localStorage.getItem(this.key);
    return data ? JSON.parse(data) : [];
  }
}

export const recordStorage = new RecordStorage()