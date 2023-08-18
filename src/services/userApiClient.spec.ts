// src/services/userApiClient.spec.ts
import { User, getById, list, save } from './userApiClient';
import { resetHandlers } from '@test/mock-server';
import { rest } from 'msw';
import deepEqual from 'deep-equal';
import { HttpStatusError } from '../utils/http-status-error';

function buildUser(): User {
  return {
    id: 1,
    firstName: 'Tom',
    lastName: 'Marien',
    email: 'tom.marien@euri.com',
    age: 45,
    homeAddress: {
      addressLine: 'Edith Cavelllaan 16',
      city: "Sint-Job-in-'t-Goor",
      zip: 'B2960',
    },
  };
}

describe('userApiClient', () => {
  describe('getById', () => {
    it('returns the user', async () => {
      const user = buildUser();

      resetHandlers(rest.get('*/users/1', (_req, res, ctx) => res(ctx.json(user))));

      const result = await getById(user.id);

      expect(result).toStrictEqual(user);
    });

    it('throws an httpStatusError if user is not found', async () => {
      expect.assertions(3);

      resetHandlers(rest.get('*/users/1', (_req, res, ctx) => res(ctx.status(404))));

      try {
        await getById(1);
      } catch (err) {
        expect(err).toBeInstanceOf(HttpStatusError);

        const httpStatusError = err as HttpStatusError;
        expect(httpStatusError.status).toBe(404);
        expect(httpStatusError.statusText).toBe('Not Found');
      }
    });
  });

  describe('list', () => {
    it('returns the data', async () => {
      const resources = [buildUser(), buildUser()];
      const body = { items: resources, total: 100 };

      resetHandlers(
        rest.get('*/users', (_req, res, ctx) =>
          res(ctx.json(body.items), ctx.set('X-Total-Count', body.total.toString())),
        ),
      );

      const result = await list();

      expect(result).toStrictEqual(body);
    });

    it('supports querying for a specific page', async () => {
      const page = 2;
      const body = { items: [], total: 1 };

      resetHandlers(
        rest.get('*/users', (req, res, ctx) => {
          if (req.url.searchParams.get('_page') !== page.toString()) throw new Error('Unexpected page');

          return res(ctx.json(body.items), ctx.set('X-Total-Count', body.total.toString()));
        }),
      );

      const result = await list({ page });
      expect(result).toStrictEqual(body);
    });

    it('supports querying for a specific pageSize', async () => {
      const pageSize = 20;
      const body = { items: [], total: 1 };

      resetHandlers(
        rest.get('*/users', (req, res, ctx) => {
          if (req.url.searchParams.get('_limit') !== pageSize.toString()) throw new Error('Unexpected pageSize');

          return res(ctx.json(body.items), ctx.set('X-Total-Count', body.total.toString()));
        }),
      );

      const result = await list({ pageSize });
      expect(result).toStrictEqual(body);
    });
  });

  describe('save', () => {
    it('creates the user if data has no id and returns the result', async () => {
      const responseBody = buildUser();

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id, ...otherProps } = responseBody;

      const requestBody = { ...otherProps };

      resetHandlers(
        rest.post('*/users', async (req, res, ctx) => {
          const body = await req.json();
          if (!deepEqual(await body, requestBody))
            throw new Error(`Unexpected body: received ${JSON.stringify(body, undefined, '  ')}`);

          return res(ctx.json(responseBody));
        }),
      );
      const result = await save(requestBody);
      expect(result).toStrictEqual(responseBody);
    });

    it('updates the user if data has no id and returns the result', async () => {
      const responseBody = buildUser();

      resetHandlers(
        rest.put(`*/users/${responseBody.id}`, async (req, res, ctx) => {
          const body = await req.json();
          if (!deepEqual(await body, responseBody))
            throw new Error(`Unexpected body: received ${JSON.stringify(body, undefined, '  ')}`);

          return res(ctx.json(responseBody));
        }),
      );
      const result = await save(responseBody);
      expect(result).toStrictEqual(responseBody);
    });
  });
});
