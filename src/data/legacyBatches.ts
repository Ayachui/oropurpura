import type { InventoryLot } from '../types/inventory';

/**
 * Archived / already-released physical batches whose printed QR codes
 * must continue to resolve cleanly on oropurpura.incatrailfoods.com
 * without appearing in the v2.1 active storefront (/bloques).
 */
export const LEGACY_RELEASED_LOTS: InventoryLot[] = [
  {
    lotId: 'OP-2026-001',
    active: false,
    title: {
      es: 'Edición Inaugural — Cacao Púrpura Vivo (Lote OP-2026-001)',
      en: 'Inaugural Release — Living Purple Cacao (Batch OP-2026-001)',
    },
    origin: {
      es: 'Finca La Libertad, Zamora-Chinchipe, Ecuador',
      en: 'Finca La Libertad, Zamora-Chinchipe, Ecuador',
    },
    altitude: 'Zamora-Chinchipe',
    harvestDate: {
      es: 'Elab: 2026-11-17 • Venc: 2028-05-10',
      en: 'Prod: 2026-11-17 • Best before: 2028-05-10',
    },
    tastingNotes: {
      es: '0% Fermentación (FMAD / VMC) • 0% Lácteos / 0% Lecitina • Estándar GMP / HACCP',
      en: '0% Fermentation (FMAD / VMC) • 0% Dairy / 0% Lecithin • GMP / HACCP Standard',
    },
    formula: {
      es: 'Pasta viva púrpura Cacao Nacional Zamora 18 µm (63.0%), manteca dorada nativa prensada en frío (5.5%), panela orgánica micropulverizada (27.0%), maca gelatinizada, hibisco, guayusa, vainilla (3.13%), sal marina, ishpingo, pimienta negra, moringa y copaiba (1.37%)',
      en: 'Living purple Cacao Nacional Zamora paste 18 µm (63.0%), cold-pressed native cacao butter (5.5%), micropulverized organic panela (27.0%), gelatinized maca, hibiscus, guayusa, vanilla (3.13%), sea salt, ishpingo, black pepper, moringa & copaiba (1.37%)',
    },
    tznk: {
      badge: 'TZNK VERIFIED • NFT BASE L2 #13',
      url: 'https://www.incatrailfoods.com/products',
    },
    incaTrailLot: {
      id: 'OP-2026-001',
      sourceBatchId: 'PURP-02_10_2026-2',
      title: 'Cacao Púrpura Vivo — Lote PURP-02_10_2026-2',
      farmerName: 'Lauro Ankuach',
      community: 'Finca La Libertad, Zamora-Chinchipe',
      region: 'Zamora-Chinchipe, Ecuador',
      harvestDate: 'Elab: 2026-11-17 • Venc: 2028-05-10',
      nftTokenId: '13',
      traceUrl: 'https://www.incatrailfoods.com/products',
    },
    blocks: [
      {
        blockId: '1000G-01',
        weight_g: 1000,
        status: 'vendido',
      },
    ],
  },
];
