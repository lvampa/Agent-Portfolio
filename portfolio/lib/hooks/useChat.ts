'use client';

import { useCallback, useState } from 'react';
import { chatClient } from '@lib/api/chatClient';
import { Client } from '@lib/api/types';
import { UseChat } from './types';

export default function useChat(): UseChat {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [data, setData] = useState<unknown>(null);

  const sendMessage = useCallback(
    async (message: string) => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await chatClient.post({ "chatInput": message });
        setData(response);
        return response;
      } catch (e) {
        setError(e instanceof Error ? e : new Error(String(e)));
      } finally {
        setIsLoading(false);
      }
    },
    [chatClient]
  );

  const reset = useCallback(() => {
    setError(null);
    setData(null);
  }, []);

  return { sendMessage, isLoading, error, data, reset };
}
