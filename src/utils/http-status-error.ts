// src/utils/http-status-error.ts
export class HttpStatusError {
  data?: object;

  constructor(public readonly status: number, public readonly statusText: string, public readonly headers: Headers) {}
}
