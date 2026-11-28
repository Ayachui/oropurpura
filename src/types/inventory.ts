export type Lang = 'es' | 'en';

export interface LocalizedText {
  es: string;
  en: string;
}

export type BlockStatus = 'disponible' | 'vendido';

export interface InventoryBlock {
  blockId: string;
  weight_g: number;
  status: BlockStatus;
}

export interface IncaTrailLotLink {
  id: string;
  sourceBatchId: string;
  title: string;
  farmerName?: string;
  community?: string;
  region?: string;
  harvestDate?: string;
  thermalShockTempC?: number;
  secondaryDryingTempC?: number;
  finalMoisturePercent?: number;
  nftTokenId?: string;
  basescanNftUrl?: string;
  traceUrl: string;
}

export interface InventoryLot {
  lotId: string;
  active: boolean;
  pricePerKgUsd?: number;
  title: LocalizedText;
  origin: LocalizedText;
  altitude: string;
  harvestDate: string | LocalizedText;
  tastingNotes: LocalizedText;
  formula: LocalizedText;
  tznk: {
    badge: string;
    url: string;
  };
  incaTrailLot?: IncaTrailLotLink;
  blocks: InventoryBlock[];
}

export interface WhatsAppTemplates {
  blockEs: string;
  blockEn: string;
  b2bEs: string;
  b2bEn: string;
  generalEs: string;
  generalEn: string;
}

export interface LogisticsSettings {
  shippingTitleEs: string;
  shippingBodyEs: string;
  shippingTitleEn: string;
  shippingBodyEn: string;
  paymentsTitleEs: string;
  paymentsSummaryEs: string;
  paymentsTitleEn: string;
  paymentsSummaryEn: string;
}

export interface InventoryConfig {
  whatsappPhone: string;
  pricePerGramUsd: number;
  b2bDiscountPercent?: number;
  b2bPricePerKgUsd?: number;
  b2bMinKgPerMonth: number;
  googleSheetsCsvUrl: string;
  whatsappTemplates?: Partial<WhatsAppTemplates>;
  logistics?: Partial<LogisticsSettings>;
}

export interface InventoryData {
  config: InventoryConfig;
  lots: InventoryLot[];
}
