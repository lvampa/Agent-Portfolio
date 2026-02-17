import { ChatClient } from "@lib/api/ChatClient";

export * from "./types";
export const chatClient = new ChatClient(process.env.NEXT_PUBLIC_CHAT_WEBHOOK_URL ?? '');