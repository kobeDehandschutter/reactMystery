// src/utils/fetcher.ts
import { HttpStatusError } from './http-status-error';

interface FetcherResponse<T> {
  status: number;
  statusText: string;
  data: T;
  headers: Headers;
}

export async function fetcher<T>(input: RequestInfo | URL, init?: RequestInit): Promise<FetcherResponse<T>> {
  const res = await fetch(input, init);

  if (!res.ok) {
    const error = new HttpStatusError(res.status, res.statusText, res.headers);
    if (res.headers.get('content-type')?.includes('application/json')) {
      error.data = await res.json();
    }

    throw error;
  }

  const data = await res.json();

  return {
    status: res.status,
    statusText: res.statusText,
    headers: res.headers,
    data,
  };
}

export function isAbortError(err: unknown): boolean {
  return err instanceof DOMException && err.name === 'AbortError';
}
