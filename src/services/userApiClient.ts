// src/services/userApiClient.ts
import { fetcher } from '../utils/fetcher';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  age?: number;
  email: string;
  homeAddress?: {
    addressLine?: string;
    city?: string;
    zip?: string;
  };
}

export interface AbortOptions {
  signal: AbortSignal;
}

export interface PagedResult<T> {
  items: T[];
  total: number;
}

export interface PagingOptions {
  page?: number;
  pageSize?: number;
}

export async function getById(id: number, { signal }: Partial<AbortOptions> = {}): Promise<User> {
  const { data } = await fetcher<User>(`${process.env.REACT_APP_API_BASE_URL}/users/${id}`, { signal });

  return data;
}

export async function list(
  { page = 1, pageSize = 20 }: PagingOptions = {},
  { signal }: Partial<AbortOptions> = {},
): Promise<PagedResult<User>> {
  const query = new URLSearchParams();
  query.append('_page', page.toString());
  query.append('_limit', pageSize.toString());

  const { data: items, headers } = await fetcher<User[]>(`${process.env.REACT_APP_API_BASE_URL}/users?${query}`, {
    signal,
  });

  return {
    items,
    total: Number(headers.get('X-Total-Count')),
  };
}

export async function save(user: Omit<User, 'id'> | User): Promise<User> {
  if (!('id' in user)) {
    const { data } = await fetcher<User>(`${process.env.REACT_APP_API_BASE_URL}/users`, {
      method: 'POST',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  } else {
    const { data } = await fetcher<User>(`${process.env.REACT_APP_API_BASE_URL}/users/${user.id}`, {
      method: 'PUT',
      body: JSON.stringify(user),
      headers: { 'Content-Type': 'application/json' },
    });
    return data;
  }
}
