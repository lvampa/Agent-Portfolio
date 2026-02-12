import { act, renderHook, waitFor } from '@testing-library/react';
import useChat from '../useChat';

jest.mock('@lib/api/chatClient', () => {
  const post = jest.fn();
  return {
    chatClient: { post },
    __chatClientMock: { post },
  };
});

const { __chatClientMock } = require('@lib/api/chatClient');
const getPostMock = () => __chatClientMock.post as jest.Mock;

describe('useChat', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('returns expected initial state', () => {
    const { result } = renderHook(() => useChat());
    expect(result.current.sendMessage).toBeInstanceOf(Function);
    expect(result.current.isLoading).toBe(false);
    expect(result.current.error).toBe(null);
    expect(result.current.data).toBe(null);
  });

  test('posts chatInput payload and stores response on success', async () => {
    const mockResponse = { reply: 'Hi there' };
    getPostMock().mockResolvedValue(mockResponse);
    const { result } = renderHook(() => useChat());

    await act(async () => {
      const response = await result.current.sendMessage('Hello');
      expect(response).toEqual(mockResponse);
    });

    expect(getPostMock()).toHaveBeenCalledWith({ chatInput: 'Hello' });
    expect(result.current.data).toEqual(mockResponse);
    expect(result.current.error).toBe(null);
    expect(result.current.isLoading).toBe(false);
  });

  test('sets loading while request is in flight', async () => {
    let resolveRequest: (value: unknown) => void;
    getPostMock().mockImplementation(
      () =>
        new Promise((resolve) => {
          resolveRequest = resolve;
        })
    );

    const { result } = renderHook(() => useChat());
    expect(result.current.isLoading).toBe(false);

    act(() => {
      void result.current.sendMessage('Hello');
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(true);
    });

    await act(async () => {
      resolveRequest!({ done: true });
    });

    await waitFor(() => {
      expect(result.current.isLoading).toBe(false);
    });
  });

  test('stores thrown Error and resolves undefined', async () => {
    const networkError = new Error('Network Error');
    getPostMock().mockRejectedValue(networkError);
    const { result } = renderHook(() => useChat());

    await act(async () => {
      const response = await result.current.sendMessage('Hello');
      expect(response).toBeUndefined();
    });

    expect(result.current.error).toEqual(networkError);
    expect(result.current.isLoading).toBe(false);
  });

  test('wraps non-Error rejections into Error', async () => {
    getPostMock().mockRejectedValue('boom');
    const { result } = renderHook(() => useChat());

    await act(async () => {
      await result.current.sendMessage('Hello');
    });

    expect(result.current.error).toBeInstanceOf(Error);
    expect(result.current.error?.message).toBe('boom');
    expect(result.current.isLoading).toBe(false);
  });
});
