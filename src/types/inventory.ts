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

export interface InventoryLot {
  lotId: string;
  active: boolean;
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
  blocks: InventoryBlock[];
}

export interface InventoryConfig {
  whatsappPhone: string;
  pricePerGramUsd: number;
  b2bPricePerKgUsd: number;
  b2bMinKgPerMonth: number;
  googleSheetsCsvUrl: string;
}

export interface InventoryData {
  config: InventoryConfig;
  lots: InventoryLot[];
}
