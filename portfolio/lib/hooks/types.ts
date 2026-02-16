export interface UseChat {
    sendMessage: (message: string) => Promise<unknown>;
    isLoading: boolean;
    error: Error | null;
    data: unknown;
  }