import { describe, expect, it } from 'vitest';
import { apiError, badRequest, unauthorized } from '@/lib/api/errors';

describe('api errors helper', () => {
  it('returns standard error shape and status', async () => {
    const response = apiError(418, 'BAD_REQUEST', 'teapot', { foo: 'bar' });

    expect(response.status).toBe(418);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'BAD_REQUEST',
        message: 'teapot',
        details: { foo: 'bar' },
      },
    });
  });

  it('keeps convenience helpers aligned', async () => {
    const response = unauthorized();

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'UNAUTHORIZED',
        message: 'Não autorizado',
      },
    });
  });

  it('includes zod issue payloads through badRequest', async () => {
    const issues = [{ path: ['title'], message: 'Required' }];
    const response = badRequest('Invalid request body', issues);

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: {
        code: 'BAD_REQUEST',
        message: 'Invalid request body',
        details: issues,
      },
    });
  });
});
