import { useCallback, useEffect, useState } from 'react';
import type { OroProductionBatch, OroSetId, OroSetInventory } from '../types/liveInventory';

const STORAGE_KEY = 'oro_ecosystem_admin_token';

function readHashToken(): string {
  if (typeof window === 'undefined') return '';
  const hash = window.location.hash || '';
  const m = /eco_token=([^&]+)/.exec(hash);
  return m?.[1] ? decodeURIComponent(m[1]).trim() : '';
}

function readStoredToken(): string {
  if (typeof window === 'undefined') return '';
  try {
    return window.localStorage.getItem(STORAGE_KEY) || window.sessionStorage.getItem(STORAGE_KEY) || '';
  } catch {
    return window.sessionStorage.getItem(STORAGE_KEY) || '';
  }
}

function persistStoredToken(tok: string): void {
  try {
    if (tok) {
      window.localStorage.setItem(STORAGE_KEY, tok);
      window.sessionStorage.setItem(STORAGE_KEY, tok);
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
      window.sessionStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // ignore
  }
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

type Eip1193Provider = {
  request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
};

export function OroAdminModal({
  open,
  onClose,
  onChanged,
}: {
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [token, setToken] = useState(() => readHashToken() || readStoredToken());
  const [wallet, setWallet] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [batches, setBatches] = useState<OroProductionBatch[]>([]);
  const [sets, setSets] = useState<Record<OroSetId, OroSetInventory> | null>(null);
  const [hasInjectedWallet] = useState(
    () => typeof window !== 'undefined' && Boolean((window as unknown as { ethereum?: unknown }).ethereum),
  );

  const loadAdmin = useCallback(async (tok: string) => {
    const headers: Record<string, string> = tok ? { Authorization: `Bearer ${tok}` } : {};
    const res = await fetch('/api/oropurpura/admin/batches', { headers, credentials: 'include' });
    const json = (await res.json()) as {
      ok?: boolean;
      batches?: OroProductionBatch[];
      sets?: Record<OroSetId, OroSetInventory>;
    };
    if (json.ok) {
      setBatches(json.batches || []);
      setSets(json.sets || null);
    }
  }, []);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    const hashTok = readHashToken();
    if (hashTok) {
      persistStoredToken(hashTok);
      window.history.replaceState(null, '', `${window.location.pathname}${window.location.search}`);
    }
    const saved = hashTok || token || readStoredToken();
    void fetch('/api/ecosystem/session', {
      headers: saved ? { Authorization: `Bearer ${saved}` } : {},
      credentials: 'include',
    })
      .then((r) => r.json())
      .then((d: { sessionValid?: boolean; wallet?: string }) => {
        if (!cancelled && d.sessionValid && d.wallet) {
          setWallet(d.wallet);
          void loadAdmin(saved);
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [open, token, loadAdmin]);

  if (!open) return null;

  const openBaseSso = () => {
    const ret = encodeURIComponent(`${window.location.origin}/admin`);
    window.location.href = `https://www.tzunki.com/ops?returnTo=${ret}`;
  };

  const handleSignIn = async () => {
    setBusy(true);
    setError(null);
    try {
      const eth = (window as unknown as { ethereum?: Eip1193Provider }).ethereum;
      if (!eth) {
        openBaseSso();
        return;
      }
      const accounts = (await eth.request({ method: 'eth_requestAccounts' })) as string[];
      const addr = accounts?.[0]?.toLowerCase();
      if (!addr) throw new Error('Wallet no seleccionada');

      const issuedAt = Date.now();
      const message = `Tzunki Ecosystem Admin\nAction: admin session\nWallet: ${addr}\nIssued (ms): ${issuedAt}`;
      const signature = (await eth.request({
        method: 'personal_sign',
        params: [toHexUtf8(message), addr],
      })) as string;

      const res = await fetch('/api/ecosystem/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ address: addr, issuedAt, message, signature }),
      });
      const json = (await res.json()) as { ok?: boolean; token?: string; wallet?: string; error?: string };
      if (!res.ok || !json.ok || !json.token) throw new Error(json.error || 'No autorizado');
      persistStoredToken(json.token);
      setToken(json.token);
      setWallet(json.wallet || addr);
      await loadAdmin(json.token);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error de autenticación');
    } finally {
      setBusy(false);
    }
  };

  const quickBatch = async (code: string, action: 'decrement' | 'increment', deltaKg: number) => {
    setError(null);
    const res = await fetch(`/api/oropurpura/admin/batches/${encodeURIComponent(code)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify({ action, deltaKg }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !json.ok) {
      setError(json.error || 'Error');
      return;
    }
    await loadAdmin(token);
    onChanged();
  };

  const quickSet = async (setId: OroSetId, delta: number) => {
    setError(null);
    const res = await fetch(`/api/oropurpura/admin/sets/${encodeURIComponent(setId)}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      credentials: 'include',
      body: JSON.stringify({ delta }),
    });
    const json = (await res.json()) as { ok?: boolean; error?: string };
    if (!res.ok || !json.ok) {
      setError(json.error || 'Error');
      return;
    }
    await loadAdmin(token);
    onChanged();
  };

  return (
    <div className="oro-admin-backdrop" role="dialog" aria-modal="true" onClick={onClose}>
      <div className="oro-admin-modal" onClick={(e) => e.stopPropagation()}>
        <div className="oro-admin-header">
          <div>
            <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--purple-raw)' }}>
              UNIFIED BASE L2 ADMIN AUTH
            </div>
            <h3 style={{ margin: '4px 0 0' }}>Oro Púrpura • Inventario Rápido</h3>
          </div>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://www.tzunki.com/ops"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-spec-toggle"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                whiteSpace: 'nowrap',
                textDecoration: 'none',
                minHeight: '40px',
                padding: '0 12px',
              }}
            >
              Base Ops ↗
            </a>
            {wallet ? (
              <button
                type="button"
                className="btn-spec-toggle"
                style={{ minHeight: '40px', padding: '0 10px' }}
                onClick={() => {
                  persistStoredToken('');
                  setToken('');
                  setWallet('');
                }}
              >
                Salir
              </button>
            ) : null}
            <button
              type="button"
              className="btn-spec-toggle"
              style={{ minHeight: '40px', padding: '0 12px' }}
              onClick={onClose}
            >
              ✕
            </button>
          </div>
        </div>

        {!wallet ? (
          <div style={{ padding: '24px 0', textAlign: 'center', display: 'grid', gap: '10px', justifyItems: 'center' }}>
            <p style={{ color: 'var(--ink-muted)', fontSize: '0.92rem', margin: 0 }}>
              Conecta y firma con el mismo wallet Base L2 administrador de Campo.
            </p>
            <button
              type="button"
              disabled={busy}
              onClick={() => void handleSignIn()}
              className="btn-wa"
              style={{ marginTop: '6px' }}
            >
              {busy
                ? 'Firmando…'
                : hasInjectedWallet
                  ? 'Firmar entrada Base L2'
                  : 'Entrar con Base Account / WalletConnect ↗'}
            </button>
            {hasInjectedWallet ? (
              <button
                type="button"
                className="btn-spec-toggle"
                style={{ minHeight: '40px', fontSize: '0.76rem' }}
                onClick={openBaseSso}
              >
                Entrar con Base Account Passkey ↗
              </button>
            ) : null}
            {error ? <p style={{ color: '#991b1b', fontSize: '0.82rem', margin: 0 }}>{error}</p> : null}
          </div>
        ) : (
          <div style={{ display: 'grid', gap: '18px', marginTop: '16px' }}>
            {error ? <p style={{ color: '#991b1b', fontSize: '0.85rem' }}>{error}</p> : null}

            {sets ? (
              <div>
                <h4 className="mono" style={{ margin: '0 0 8px', fontSize: '0.78rem' }}>
                  CUOTA DE SETS (BOTÓN RÁPIDO −1)
                </h4>
                <div className="oro-admin-grid">
                  {(['set-01', 'set-02', 'set-03'] as OroSetId[]).map((id) => (
                    <div key={id} className="oro-admin-card">
                      <div className="mono" style={{ fontSize: '0.72rem' }}>
                        {sets[id].name}
                      </div>
                      <strong className="mono" style={{ fontSize: '1.15rem' }}>
                        {sets[id].remainingCount} / {sets[id].quotaTotal}
                      </strong>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                        <button
                          type="button"
                          className="trace-pill-btn active"
                          onClick={() => void quickSet(id, -1)}
                        >
                          −1
                        </button>
                        <button
                          type="button"
                          className="trace-pill-btn"
                          onClick={() => void quickSet(id, 1)}
                        >
                          +1
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div>
              <h4 className="mono" style={{ margin: '0 0 8px', fontSize: '0.78rem' }}>
                PARTIDAS ACTIVAS (DESCUENTO POR VENTA WHATSAPP)
              </h4>
              <div style={{ display: 'grid', gap: '10px' }}>
                {batches.map((b) => (
                  <div key={b.batchCode} className="oro-admin-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '8px' }}>
                      <div>
                        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--purple-raw)' }}>
                          {b.batchCode}
                        </span>
                        <div style={{ fontWeight: 700 }}>{b.recipe.name}</div>
                      </div>
                      <div className="mono" style={{ fontWeight: 700 }}>
                        {b.remainingKg} / {b.producedKg} kg
                      </div>
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
                      <button
                        type="button"
                        className="trace-pill-btn active"
                        onClick={() => void quickBatch(b.batchCode, 'decrement', 0.25)}
                      >
                        −250 g
                      </button>
                      <button
                        type="button"
                        className="trace-pill-btn active"
                        onClick={() => void quickBatch(b.batchCode, 'decrement', 0.5)}
                      >
                        −500 g
                      </button>
                      <button
                        type="button"
                        className="trace-pill-btn active"
                        onClick={() => void quickBatch(b.batchCode, 'decrement', 1.0)}
                      >
                        −1 kg
                      </button>
                      <button
                        type="button"
                        className="trace-pill-btn"
                        onClick={() => void quickBatch(b.batchCode, 'increment', 0.25)}
                      >
                        +250 g
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
