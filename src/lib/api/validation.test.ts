import { describe, expect, it } from 'vitest';
import { z } from 'zod';
import { parseBody, parseParams, parseQuery } from '@/lib/api/validation';

const payloadSchema = z.object({
  title: z.string().min(1),
});

describe('api validation helpers', () => {
  it('parseBody returns parsed data on success', async () => {
    const request = new Request('http://localhost/api/test', {
      method: 'POST',
      body: JSON.stringify({ title: 'Pulse' }),
      headers: { 'content-type': 'application/json' },
    });

    const result = await parseBody(request, payloadSchema);

    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual({ title: 'Pulse' });
    }
  });

  it('parseBody returns standardized error on malformed json', async () => {
    const request = new Request('http://localhost/api/test', {
      method: 'POST',
      body: '{bad-json',
      headers: { 'content-type': 'application/json' },
    });

    const result = await parseBody(request, payloadSchema);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.response.status).toBe(400);
      await expect(result.response.json()).resolves.toMatchObject({
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid JSON body',
        },
      });
    }
  });

  it('parseParams validates route params', async () => {
    const paramsSchema = z.object({ pageId: z.string().uuid() });
    const result = parseParams({ pageId: 'not-uuid' }, paramsSchema);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.response.status).toBe(400);
      await expect(result.response.json()).resolves.toMatchObject({
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid route params',
        },
      });
    }
  });

  it('parseQuery validates search params', async () => {
    const querySchema = z.object({ days: z.coerce.number().min(1).max(30) });
    const result = parseQuery(new URLSearchParams({ days: '99' }), querySchema);

    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.response.status).toBe(400);
      await expect(result.response.json()).resolves.toMatchObject({
        error: {
          code: 'BAD_REQUEST',
          message: 'Invalid query params',
        },
      });
    }
  });
});
