import { useState, useCallback } from 'react';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function usePostApi<T>() {
  const [response, setResponse] = useState<ApiResponse<T>>({
    data: null,
    loading: false,
    error: null,
  });

  const post = useCallback(async (url: string, data: any) => {
    setResponse(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      setResponse({
        data: responseData,
        loading: false,
        error: null,
      });
      return responseData;
    } catch (err) {
      setResponse({
        data: null,
        loading: false,
        error: err instanceof Error ? err : new Error('An error occurred'),
      });
      throw err instanceof Error ? err : new Error('An error occurred');
    }
  }, []);

  return {
    post,
    ...response,
  };
}
