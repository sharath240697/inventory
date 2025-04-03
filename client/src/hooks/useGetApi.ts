import { useState, useEffect } from 'react';

interface ApiResponse<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export function useGetApi<T>(url: string) {
  const [response, setResponse] = useState<ApiResponse<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setResponse({
          data,
          loading: false,
          error: null,
        });
      } catch (err) {
        setResponse({
          data: null,
          loading: false,
          error: err instanceof Error ? err : new Error('An error occurred'),
        });
      }
    };

    fetchData();
  }, [url]);

  return response;
}
