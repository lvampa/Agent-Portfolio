import { createEventBus } from "./eventBus";

export type { CallbackFn as EventBusCallbackFn } from "./types";
export const eventBus = createEventBus();