export type UnregisterFn = () => void;

export type CallbackFn<T = any> = (event?: T) => void | Promise<void>;

export interface Event {
  [key: string]: any;
}

export interface EventBus {
  on: (eventName: string, fn: CallbackFn) => UnregisterFn,
  off: (eventName: string, fn: CallbackFn) => void,
  emit: <T = Event>(eventName: string, event?: T) => void
}