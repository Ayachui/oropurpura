import type { IncaTrailLotLink, InventoryLot } from '../types/inventory';

interface RawShowcaseLot {
  id?: string;
  sourceBatchId?: string;
  productType?: string;
  productLabel?: string;
  title?: string;
  subtitle?: string;
  initialKg?: number | null;
  availableKg?: number | null;
  nftTokenId?: string;
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

function mapRawLot(raw: RawShowcaseLot): IncaTrailLotLink | null {
  const id = String(raw.id || raw.sourceBatchId || '').trim();
  const sourceBatchId = String(raw.sourceBatchId || raw.id || '').trim();
  if (!id && !sourceBatchId) return null;

  return {
    id: id || sourceBatchId,
    sourceBatchId: sourceBatchId || id,
    title: String(raw.title || raw.productLabel || sourceBatchId || id),
    farmerName: raw.origin?.farmerName,
    community: raw.origin?.community,
    region: raw.origin?.region || 'Zamora-Chinchipe',
    harvestDate: raw.origin?.harvestDate,
    thermalShockTempC: raw.fmadSummary?.thermalShockTempC,
    secondaryDryingTempC: raw.fmadSummary?.secondaryDryingTempC,
    finalMoisturePercent: raw.fmadSummary?.finalMoisturePercent,
    nftTokenId: raw.nftTokenId,
    basescanNftUrl: raw.basescanNftUrl,
    traceUrl: raw.traceUrl || 'https://www.incatrailfoods.com/products',
  };
}

export function buildFallbackIncaTrailLots(localLots: InventoryLot[]): IncaTrailLotLink[] {
  return localLots.map((lot) => ({
    id: lot.incaTrailLot?.id || lot.lotId,
    sourceBatchId: lot.incaTrailLot?.sourceBatchId || lot.lotId,
    title: lot.title.es,
    community: lot.origin.es,
    region: 'Zamora-Chinchipe',
    harvestDate: typeof lot.harvestDate === 'string' ? lot.harvestDate : lot.harvestDate.es,
    traceUrl: lot.incaTrailLot?.traceUrl || 'https://www.incatrailfoods.com/products',
  }));
}

export async function fetchIncaTrailLots(
  localLots: InventoryLot[],
  signal?: AbortSignal,
): Promise<{ lots: IncaTrailLotLink[]; source: 'api' | 'fallback' }> {
  const endpoints = [
    '/api/itf/showcase',
    'https://www.incatrailfoods.com/api/itf/showcase',
  ];

  for (const url of endpoints) {
    try {
      const res = await fetch(url, { cache: 'no-store', signal });
      if (!res.ok) continue;
      const json = (await res.json()) as {
        ok?: boolean;
        lots?: RawShowcaseLot[];
        activeLots?: RawShowcaseLot[];
        pastLots?: RawShowcaseLot[];
      };

      // Combine all lots regardless of sold/active status
      const rawList: RawShowcaseLot[] = [
        ...(Array.isArray(json.lots) ? json.lots : []),
        ...(Array.isArray(json.activeLots) ? json.activeLots : []),
        ...(Array.isArray(json.pastLots) ? json.pastLots : []),
      ];

      const deduped = new Map<string, IncaTrailLotLink>();
      for (const item of rawList) {
        const mapped = mapRawLot(item);
        if (mapped && !deduped.has(mapped.sourceBatchId)) {
          deduped.set(mapped.sourceBatchId, mapped);
        }
      }

      if (deduped.size > 0) {
        return { lots: Array.from(deduped.values()), source: 'api' };
      }
    } catch {
      // Try next endpoint or fallback
    }
  }

  return { lots: buildFallbackIncaTrailLots(localLots), source: 'fallback' };
}
