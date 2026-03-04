import { describe, expect, it } from 'vitest';
import { resolveVisitorIdFromHeaders } from '@/lib/analytics/visitor';

describe('resolveVisitorIdFromHeaders', () => {
  it('returns stable ID for same request fingerprint', () => {
    const headersA = new Headers({
      'user-agent': 'Mozilla/5.0 Pulse',
      'accept-language': 'pt-BR,pt;q=0.9',
      'x-forwarded-for': '203.0.113.1',
    });
    const headersB = new Headers({
      'user-agent': 'Mozilla/5.0 Pulse',
      'accept-language': 'pt-BR,pt;q=0.9',
      'x-forwarded-for': '203.0.113.1',
    });

    expect(resolveVisitorIdFromHeaders(headersA)).toBe(
      resolveVisitorIdFromHeaders(headersB),
    );
  });

  it('changes ID when fingerprint changes', () => {
    const headersA = new Headers({
      'user-agent': 'Mozilla/5.0 Pulse',
      'accept-language': 'pt-BR',
      'x-forwarded-for': '203.0.113.1',
    });
    const headersB = new Headers({
      'user-agent': 'Mozilla/5.0 Pulse',
      'accept-language': 'en-US',
      'x-forwarded-for': '203.0.113.1',
    });

    expect(resolveVisitorIdFromHeaders(headersA)).not.toBe(
      resolveVisitorIdFromHeaders(headersB),
    );
  });

  it('returns fallback hash when no useful headers are present', () => {
    const id = resolveVisitorIdFromHeaders(new Headers());

    expect(id).toHaveLength(24);
  });
});
