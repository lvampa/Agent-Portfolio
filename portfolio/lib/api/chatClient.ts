import axios, { AxiosInstance } from 'axios';
import { Client as ClientType } from './types';

export class ChatClient implements ClientType {
  private readonly axios: AxiosInstance;

  constructor(private readonly endpoint: string) {
    this.axios = axios.create({
      baseURL: endpoint,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  async post<T = unknown>(payload: unknown): Promise<T> {
    const { data } = await this.axios.post<T>(this.endpoint, payload);
    return data;
  }

  getWebhookUrl(): string {
    return this.endpoint;
  }
}

export const client = new ChatClient(process.env.NEXT_PUBLIC_CHAT_WEBHOOK_URL ?? '');

