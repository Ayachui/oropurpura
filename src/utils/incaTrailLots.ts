import type { IncaTrailLotLink } from '../types/inventory';

interface RawShowcaseLot {
  id?: string;
  sourceBatchId?: string;
  productType?: string;
  productLabel?: string;
  title?: string;
  subtitle?: string;
  initialKg?: number | null;
  allocatedKg?: number | null;
  availableKg?: number | null;
  nftTokenId?: string;
  mintTxHash?: string;
  basescanNftUrl?: string;
  origin?: {
    farmerName?: string;
    community?: string;
    region?: string;
    harvestDate?: string;
  };
  fmadSummary?: {
    thermalShockTempC?: number;
    secondaryDryingTempC?: number;
    finalMoisturePercent?: number;
  };
  traceUrl?: string;
}

function mapRawPublishedNftLot(raw: RawShowcaseLot): IncaTrailLotLink | null {
  const id = String(raw.id || raw.sourceBatchId || '').trim();
  const sourceBatchId = String(raw.sourceBatchId || raw.id || '').trim();
  const nftTokenId = typeof raw.nftTokenId === 'string' ? raw.nftTokenId.trim() : '';

  // Strictly require a minted NFT from Almacén / Base L2
  if ((!id && !sourceBatchId) || !nftTokenId) return null;

  return {
    id: id || sourceBatchId,
    sourceBatchId: sourceBatchId || id,
    title: String(raw.title || raw.productLabel || sourceBatchId || id),
    productLabel: raw.productLabel,
    farmerName: raw.origin?.farmerName,
    community: raw.origin?.community,
    region: raw.origin?.region || 'Zamora-Chinchipe',
    harvestDate: raw.origin?.harvestDate,
    initialKg: typeof raw.initialKg === 'number' ? raw.initialKg : null,
    allocatedKg: typeof raw.allocatedKg === 'number' ? raw.allocatedKg : null,
    availableKg: typeof raw.availableKg === 'number' ? raw.availableKg : null,
    thermalShockTempC: raw.fmadSummary?.thermalShockTempC,
    secondaryDryingTempC: raw.fmadSummary?.secondaryDryingTempC,
    finalMoisturePercent: raw.fmadSummary?.finalMoisturePercent,
    nftTokenId,
    mintTxHash: typeof raw.mintTxHash === 'string' ? raw.mintTxHash.trim() || undefined : undefined,
    basescanNftUrl: raw.basescanNftUrl,
    traceUrl:
      raw.traceUrl ||
      `https://www.incatrailfoods.com/trace/${encodeURIComponent(sourceBatchId || id)}`,
  };
}

export interface FetchIncaTrailLotsResult {
  lots: IncaTrailLotLink[];
  source: 'api' | 'empty' | 'error';
  error?: string;
}

/**
 * Loads ONLY published lots with a minted NFT from Almacén via `/api/itf/showcase`.
 * Never falls back to local/mock inventory lots.
 */
export async function fetchIncaTrailLots(
  signal?: AbortSignal,
): Promise<FetchIncaTrailLotsResult> {
  const endpoints = [
    '/api/itf/showcase',
    'https://www.incatrailfoods.com/api/itf/showcase',
    'https://www.tzunki.com/api/itf/showcase',
  ];

  let lastError: string | undefined;

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { cache: 'no-store', signal });
      if (!res.ok) {
        lastError = `HTTP ${res.status}`;
        continue;
      }

      const json = (await res.json()) as {
        ok?: boolean;
        items?: RawShowcaseLot[];
        lots?: RawShowcaseLot[];
        activeLots?: RawShowcaseLot[];
        pastLots?: RawShowcaseLot[];
        error?: string;
      };

      if (json.ok === false) {
        lastError = json.error || 'API returned ok: false';
        continue;
      }

      // `/api/itf/showcase` returns `{ ok: true, items: ItfShowcasePublicCard[] }`
      // Keep all published NFT lots regardless of whether availableKg is > 0 or 0.
      const rawList: RawShowcaseLot[] = [
        ...(Array.isArray(json.items) ? json.items : []),
        ...(Array.isArray(json.lots) ? json.lots : []),
        ...(Array.isArray(json.activeLots) ? json.activeLots : []),
        ...(Array.isArray(json.pastLots) ? json.pastLots : []),
      ];

      const deduped = new Map<string, IncaTrailLotLink>();
      for (const item of rawList) {
        const mapped = mapRawPublishedNftLot(item);
        if (mapped && !deduped.has(mapped.sourceBatchId)) {
          deduped.set(mapped.sourceBatchId, mapped);
        }
      }

      const lots = Array.from(deduped.values());
      return {
        lots,
        source: lots.length > 0 ? 'api' : 'empty',
      };
    } catch (err) {
      if (signal?.aborted) {
        return { lots: [], source: 'error', error: 'aborted' };
      }
      lastError = err instanceof Error ? err.message : 'Network error';
    }
  }

  return {
    lots: [],
    source: 'error',
    error: lastError || 'No se pudo conectar con /api/itf/showcase',
  };
}
