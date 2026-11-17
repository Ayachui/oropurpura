import type { PackWeight } from '../data/content';

export type OroSkuId = 'inca' | 'andean' | 'guayusa';
export type OroSetId = 'set-01' | 'set-02' | 'set-03';

export type OroBatchLotConsumption = {
  sourceBatchId: string;
  showcaseId: string;
  usedKg: number;
  productLabel: string;
  farmerName: string;
  community: string;
  region: string;
  harvestDate: string;
  dryingMethod: string;
  thermalShockTempC?: number;
  secondaryDryingTempC?: number;
  finalMoisturePercent?: number;
  nftTokenId: string;
  mintTxHash?: string;
  basescanNftUrl?: string;
  easFinalUid?: string;
  easHarvestUid?: string;
  tznkBurned?: number;
  traceUrl: string;
};

export type OroSkuRecipeMeta = {
  skuId: OroSkuId;
  code: string;
  name: string;
  cacaoPercent: string;
  cacaoPercentEn: string;
  ingredientsEs: string[];
  ingredientsEn: string[];
  standardsEs: string[];
  standardsEn: string[];
  shelfLifeDays: number;
};

export type OroProductionBatch = {
  batchCode: string;
  skuId: OroSkuId;
  producedKg: number;
  remainingKg: number;
  soldKg: number;
  consumedLots: OroBatchLotConsumption[];
  productionDate: string;
  bestBeforeDate: string;
  standards: string[];
  recipe: OroSkuRecipeMeta;
  notes?: string;
  status: 'active' | 'depleted' | 'archived';
  createdAt: number;
  updatedAt: number;
};

export type OroSetInventory = {
  setId: OroSetId;
  name: string;
  quotaTotal: number;
  remainingCount: number;
  linkedBatchCodes: string[];
  updatedAt: number;
};

export type OroSkuPublicAvailability = {
  skuId: OroSkuId;
  totalRemainingKg: number;
  packsAvailable: Record<PackWeight, boolean>;
  inStockAny: boolean;
  primaryBatch: OroProductionBatch | null;
  activeBatches: OroProductionBatch[];
};

export type OroPublicState = {
  generatedAt: number;
  skus: Record<OroSkuId, OroSkuPublicAvailability>;
  sets: Record<OroSetId, OroSetInventory>;
  ticker: {
    totalSetsRemaining: number;
    totalSetsQuota: number;
    activeBatchCodes: string[];
    primaryOrigin: string;
  };
};
