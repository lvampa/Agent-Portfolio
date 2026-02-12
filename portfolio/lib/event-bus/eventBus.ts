import { CallbackFn, UnregisterFn, Event, EventBus } from "./types";


export function createEventBus(): EventBus {
  const handlers = new Map<string, CallbackFn[]>();

  function on(eventName: string, callback: CallbackFn): UnregisterFn {
    let eventHandlers = handlers.get(eventName) ?? [];
    eventHandlers.push(callback);
    handlers.set(eventName, eventHandlers);
    return () => off(eventName, callback);
  }

  function off(eventName: string, callback: CallbackFn) {
    const eventHandlers = handlers.get(eventName);

    if (eventHandlers) {
      eventHandlers.splice(eventHandlers.indexOf(callback) >>> 0, 1)
    }
  }

  function emit<T = Event>(eventName: string, event?: T) {
    const eventHandlers = handlers.get(eventName);
    if (eventHandlers) {
      eventHandlers.slice().forEach(async (handler) => {
        await handler(event);
      })
    }
  }

  return {
    on, off, emit
  }
}

export const eventBus = createEventBus();

