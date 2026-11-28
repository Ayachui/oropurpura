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

export type LotCategoryId = 'clasico' | 'seleccion' | 'reserva' | 'edicion';

export interface IncaTrailLotLink {
  id: string;
  sourceBatchId: string;
  title: string;
  productLabel?: string;
  farmerName?: string;
  community?: string;
  region?: string;
  harvestDate?: string;
  altitudeM?: number;
  variety?: string;
  mucilageBrix?: number;
  buyerStory?: string;
  notes?: string;
  totalTznkBurned?: number;
  heroImageUrl?: string;
  initialKg?: number | null;
  allocatedKg?: number | null;
  availableKg?: number | null;
  thermalShockTempC?: number;
  secondaryDryingTempC?: number;
  finalMoisturePercent?: number;
  nftTokenId?: string;
  mintTxHash?: string;
  basescanNftUrl?: string;
  traceUrl: string;
}

export interface InventoryLot {
  lotId: string;
  active: boolean;
  pricePerKgUsd?: number;
  category?: LotCategoryId;
  imageUrl?: string;
  imagePromptSummary?: string;
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
