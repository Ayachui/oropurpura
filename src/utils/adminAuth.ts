const STORAGE_KEY = 'oropurpura_ecosystem_admin_token';

interface Eip1193Provider {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
}

function getEthereumProvider(): Eip1193Provider | undefined {
  if (typeof window === 'undefined') return undefined;
  return (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
}

export function hasInjectedWallet(): boolean {
  return Boolean(getEthereumProvider());
}

function toHexUtf8(str: string): string {
  const bytes = new TextEncoder().encode(str);
  return (
    '0x' +
    Array.from(bytes)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('')
  );
}

/**
 * Reads `#eco_token=...` returned by Base SSO (`tzunki.com/base/ops?returnTo=...`),
 * stores it in sessionStorage, and strips the token from the URL hash.
 */
export function consumeAdminHashToken(): string {
  if (typeof window === 'undefined') return '';
  const hash = window.location.hash || '';
  const match = /eco_token=([^&]+)/.exec(hash);
  if (!match?.[1]) return '';
  const token = decodeURIComponent(match[1]).trim();
  if (token) {
    window.sessionStorage.setItem(STORAGE_KEY, token);
  }
  window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
  return token;
}

export function readStoredAdminToken(): string {
  if (typeof window === 'undefined') return '';
  return window.sessionStorage.getItem(STORAGE_KEY) || '';
}

export function clearStoredAdminToken(): void {
  if (typeof window === 'undefined') return;
  window.sessionStorage.removeItem(STORAGE_KEY);
}

export function openBaseAdminSso(): void {
  if (typeof window === 'undefined') return;
  const ret = encodeURIComponent(`${window.location.origin}/admin`);
  window.location.href = `https://www.tzunki.com/base/ops?returnTo=${ret}`;
}

export async function checkAdminSession(
  token?: string,
): Promise<{ valid: boolean; wallet?: string; roles?: string[] }> {
  const endpoints = ['/api/ecosystem/session', 'https://www.tzunki.com/api/ecosystem/session'];
  const headers: Record<string, string> = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { headers, credentials: 'include', cache: 'no-store' });
      if (!res.ok) continue;
      const data = (await res.json()) as {
        ok?: boolean;
        sessionValid?: boolean;
        wallet?: string;
        roles?: string[];
      };
      if (data.sessionValid && data.wallet) {
        return { valid: true, wallet: data.wallet, roles: data.roles };
      }
      return { valid: false };
    } catch {
      // Try next endpoint
    }
  }
  return { valid: false };
}

export async function signInAdminWithWallet(): Promise<{ token: string; wallet: string }> {
  const eth = getEthereumProvider();
  if (!eth) {
    openBaseAdminSso();
    throw new Error('NO_INJECTED_WALLET');
  }

  const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[];
  const addr = accounts?.[0]?.toLowerCase();
  if (!addr) {
    throw new Error('No se seleccionó ninguna cuenta de billetera');
  }

  const issuedAt = Date.now();
  const message = `Tzunki Ecosystem Admin\nAction: admin session\nWallet: ${addr}\nIssued (ms): ${issuedAt}`;
  const signature = (await eth.request({
    method: 'personal_sign',
    params: [toHexUtf8(message), addr],
  })) as string;

  const endpoints = ['/api/ecosystem/session', 'https://www.tzunki.com/api/ecosystem/session'];
  let lastError = 'Error al autenticar la billetera';

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ address: addr, issuedAt, message, signature }),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        token?: string;
        wallet?: string;
        error?: string;
      };
      if (res.ok && json.ok && json.token) {
        window.sessionStorage.setItem(STORAGE_KEY, json.token);
        return { token: json.token, wallet: json.wallet || addr };
      }
      lastError = json.error || `Error HTTP ${res.status}`;
      // If server explicitly rejected credentials (401/403/400), do not retry fallback endpoint
      if (res.status === 400 || res.status === 401 || res.status === 403) {
        break;
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message : 'Error de red';
    }
  }

  throw new Error(lastError);
}

export async function signOutAdminSession(): Promise<void> {
  clearStoredAdminToken();
  await fetch('/api/ecosystem/session', {
    method: 'DELETE',
    credentials: 'include',
  }).catch(() => {});
}
