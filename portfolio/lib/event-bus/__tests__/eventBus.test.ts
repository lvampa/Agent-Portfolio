import { createEventBus } from '../eventBus';
import { CallbackFn } from '../types';

describe('EventBus', () => {
  let bus: ReturnType<typeof createEventBus>;

  beforeEach(() => {
    bus = createEventBus();
  });

  test('should register and emit a synchronous event', () => {
    const mockFn = jest.fn();
    bus.on('test', mockFn);

    bus.emit('test', { foo: 'bar' });

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({ foo: 'bar' });
  });

  test('should register and emit an asynchronous event', async () => {
    const mockFn = jest.fn(async (payload) => {
      return Promise.resolve(payload);
    });

    bus.on('asyncTest', mockFn);

    await bus.emit('asyncTest', { value: 42 });

    // Give time for async handlers to complete
    await new Promise((r) => setTimeout(r, 10));

    expect(mockFn).toHaveBeenCalledTimes(1);
    expect(mockFn).toHaveBeenCalledWith({ value: 42 });
  });

  test('should call multiple handlers for the same event', () => {
    const mockFn1 = jest.fn();
    const mockFn2 = jest.fn();

    bus.on('multi', mockFn1);
    bus.on('multi', mockFn2);

    bus.emit('multi', { data: 'hello' });

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });

  test('should remove a handler with off', () => {
    const mockFn = jest.fn();
    bus.on('removeTest', mockFn);

    bus.off('removeTest', mockFn);
    bus.emit('removeTest', {});

    expect(mockFn).not.toHaveBeenCalled();
  });

  test('should return a function from on to unregister the handler', () => {
    const mockFn = jest.fn();
    const unregister = bus.on('unregisterTest', mockFn);

    unregister();
    bus.emit('unregisterTest', {});

    expect(mockFn).not.toHaveBeenCalled();
  });

  test('removing a non-existent handler should not throw', () => {
    const mockFn = jest.fn();

    expect(() => bus.off('nonExistent', mockFn)).not.toThrow();
  });

  test('emitting an event with no handlers should do nothing', () => {
    expect(() => bus.emit('noHandlers', { foo: 1 })).not.toThrow();
  });

  test('handlers can modify the handlers array during emit safely', () => {
    const mockFn1: CallbackFn = jest.fn((payload) => {
      bus.off('dynamic', mockFn2);
    });
    const mockFn2: CallbackFn = jest.fn();

    bus.on('dynamic', mockFn1);
    bus.on('dynamic', mockFn2);

    bus.emit('dynamic', {});

    expect(mockFn1).toHaveBeenCalledTimes(1);
    expect(mockFn2).toHaveBeenCalledTimes(1);
  });
});
