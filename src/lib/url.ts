export function ensureUrlProtocol(url: string): string {
  const trimmed = url.trim();

  if (!trimmed) return "";
  if (/^[a-z]+:\/\//i.test(trimmed)) return trimmed;

  return `https://${trimmed}`;
}

export function isValidHttpUrlLike(url: string): boolean {
  const normalized = ensureUrlProtocol(url);

  return /^https?:\/\/.+/i.test(normalized);
}
