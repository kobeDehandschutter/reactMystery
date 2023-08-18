import { setupServer } from 'msw/node';

type RequestHandler = Parameters<typeof setupServer>[0];

const defaultHandlers: RequestHandler[] = [];

const mockServer = setupServer(...defaultHandlers);

export function listen() {
  mockServer.listen({
    onUnhandledRequest: 'error',
  });
}

export function resetHandlers(...handlers: RequestHandler[]) {
  mockServer.resetHandlers(...defaultHandlers, ...handlers);
}

export function close() {
  mockServer.close();
}
