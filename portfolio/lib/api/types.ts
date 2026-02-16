export interface Client {
    post<T = unknown>(payload: unknown): Promise<T>;
    getWebhookUrl(): string;
}