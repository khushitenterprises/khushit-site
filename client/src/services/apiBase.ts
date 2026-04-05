function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function normalizeConfiguredBase(rawBase: string): string {
  const trimmed = trimTrailingSlash(String(rawBase || '').trim());
  if (!trimmed) {
    return '';
  }

  return trimmed.endsWith('/api') ? trimmed.slice(0, -4) : trimmed;
}

export function getApiBaseCandidates(): string[] {
  const bases: string[] = [];
  const configured = normalizeConfiguredBase(import.meta.env.VITE_API_URL || '');

  if (configured) {
    bases.push(configured);
  }

  // Same-origin calls let Vite proxy /api during local dev.
  bases.push('');

  if (typeof window !== 'undefined') {
    const { protocol, hostname, port } = window.location;
    if (protocol.startsWith('http') && hostname && port && port !== '5000') {
      bases.push(`${protocol}//${hostname}:5000`);
    }
  }

  return Array.from(new Set(bases));
}

export function buildApiUrl(base: string, endpoint: string): string {
  const safeEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${base}/api${safeEndpoint}`;
}
