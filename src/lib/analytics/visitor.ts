import { createHash } from 'node:crypto';

function normalizeHeaderValue(value: string | null) {
  return value?.trim().toLowerCase() || '';
}

export function resolveVisitorIdFromHeaders(headers: Headers): string {
  const userAgent = normalizeHeaderValue(headers.get('user-agent'));
  const language = normalizeHeaderValue(headers.get('accept-language'));
  const forwardedFor = normalizeHeaderValue(
    headers.get('x-forwarded-for') || headers.get('x-real-ip'),
  );

  const fingerprint = [userAgent, language, forwardedFor].join('|');

  if (!fingerprint.replace(/\|/g, '')) {
    return createHash('sha256').update('anonymous').digest('hex').slice(0, 24);
  }

  return createHash('sha256').update(fingerprint).digest('hex').slice(0, 24);
}
