import type { IncaTrailLotLink, LotCategoryId } from '../types/inventory';

interface RawShowcaseLot {
  id?: string;
  sourceBatchId?: string;
  productType?: string;
  productLabel?: string;
  title?: string;
  subtitle?: string;
  heroImageUrl?: string;
  initialKg?: number | null;
  allocatedKg?: number | null;
  availableKg?: number | null;
  nftTokenId?: string;
  mintTxHash?: string;
  basescanNftUrl?: string;
  buyerStory?: string;
  notes?: string;
  totalTznkBurned?: number;
  origin?: {
    farmerName?: string;
    community?: string;
    region?: string;
    harvestDate?: string;
    altitudeM?: number;
    variety?: string;
    mucilageBrix?: number;
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
    altitudeM:
      typeof raw.origin?.altitudeM === 'number' && Number.isFinite(raw.origin.altitudeM)
        ? Math.round(raw.origin.altitudeM)
        : undefined,
    variety: raw.origin?.variety,
    mucilageBrix:
      typeof raw.origin?.mucilageBrix === 'number' && Number.isFinite(raw.origin.mucilageBrix)
        ? raw.origin.mucilageBrix
        : undefined,
    buyerStory: typeof raw.buyerStory === 'string' ? raw.buyerStory.trim() || undefined : undefined,
    notes: typeof raw.notes === 'string' ? raw.notes.trim() || undefined : undefined,
    totalTznkBurned:
      typeof raw.totalTznkBurned === 'number' && raw.totalTznkBurned > 0
        ? raw.totalTznkBurned
        : undefined,
    heroImageUrl:
      typeof raw.heroImageUrl === 'string' ? raw.heroImageUrl.trim() || undefined : undefined,
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

export interface GenerateLotImageParams {
  lotId: string;
  title: string;
  categoryId: LotCategoryId;
  categoryLabel: string;
  pricePerKgUsd: number;
  formula: string;
  tastingNotes?: string;
  sourceBatchId?: string;
  almacenFallback?: {
    farmerName?: string;
    community?: string;
    region?: string;
    altitude?: string;
    harvestDate?: string;
    thermalShockTempC?: number;
    secondaryDryingTempC?: number;
    finalMoisturePercent?: number;
    variety?: string;
    mucilageBrix?: number;
    buyerStory?: string;
    notes?: string;
  };
  adminToken?: string;
}

export interface GenerateLotImageResult {
  ok: boolean;
  imageUrl?: string;
  promptSummary?: string;
  almacenEnriched?: boolean;
  error?: string;
}

/**
 * Generates a bespoke studio product image for a lot via Gemini on the backend,
 * combining the lot's rarity category, recipe ingredients, and full Almacén metadata.
 */
export async function generateOroLotImage(
  params: GenerateLotImageParams,
): Promise<GenerateLotImageResult> {
  const endpoints = [
    '/api/oropurpura/admin/generate-lot-image',
    'https://www.tzunki.com/api/oropurpura/admin/generate-lot-image',
  ];

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (params.adminToken) {
    headers.Authorization = `Bearer ${params.adminToken}`;
  }

  const payload = {
    lotId: params.lotId,
    title: params.title,
    categoryId: params.categoryId,
    categoryLabel: params.categoryLabel,
    pricePerKgUsd: params.pricePerKgUsd,
    formula: params.formula,
    tastingNotes: params.tastingNotes,
    sourceBatchId: params.sourceBatchId,
    almacenFallback: params.almacenFallback,
  };

  let lastError = 'No se pudo generar la imagen del lote';

  for (const url of endpoints) {
    try {
      const res = await fetch(url, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        ok?: boolean;
        imageUrl?: string;
        promptSummary?: string;
        almacenEnriched?: boolean;
        error?: string;
      };
      if (res.ok && json.ok && json.imageUrl) {
        return {
          ok: true,
          imageUrl: json.imageUrl,
          promptSummary: json.promptSummary,
          almacenEnriched: json.almacenEnriched,
        };
      }
      lastError = json.error || `HTTP ${res.status}`;
      if (res.status === 400 || res.status === 401 || res.status === 403 || res.status === 503) {
        break;
      }
    } catch (e) {
      lastError = e instanceof Error ? e.message : 'Error de red';
    }
  }

  return { ok: false, error: lastError };
}
