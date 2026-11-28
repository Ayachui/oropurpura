import type {
  InventoryConfig,
  InventoryLot,
  Lang,
  LocalizedText,
  LotCategoryId,
} from '../types/inventory';
import { resolveLotPricePerKg } from './whatsapp';

export interface LotCategoryMeta {
  id: LotCategoryId;
  rank: 1 | 2 | 3 | 4;
  stars: string;
  priceRangeLabel: string;
  name: LocalizedText;
  shortTag: LocalizedText;
  explainer: LocalizedText;
  /** Rich gradient for category badges, header ribbons, and active accents */
  gradient: string;
  /** Subtle tinted background for active card/panel highlights */
  softBg: string;
  /** Solid accent color for borders, pills, and indicators */
  accent: string;
  /** High-contrast foreground text on the gradient */
  textOnGradient: string;
  /** Fallback local visual when no AI image has been generated yet */
  fallbackImage: string;
}

export const LOT_CATEGORY_ORDER: LotCategoryId[] = [
  'clasico',
  'seleccion',
  'reserva',
  'edicion',
];

export const LOT_CATEGORIES: Record<LotCategoryId, LotCategoryMeta> = {
  clasico: {
    id: 'clasico',
    rank: 1,
    stars: '★',
    priceRangeLabel: '~$100/kg',
    name: {
      es: 'Cosecha Clásica',
      en: 'Classic Harvest',
    },
    shortTag: {
      es: 'Clásica',
      en: 'Classic',
    },
    explainer: {
      es: 'Nuestro cacao púrpura vivo de diario: potencia completa y pureza ancestral.',
      en: 'Our signature everyday living purple cacao: full potency and ancestral purity.',
    },
    gradient: 'linear-gradient(125deg, #2D0B4E 0%, #5B21B6 55%, #7C3AED 100%)',
    softBg: 'linear-gradient(135deg, rgba(91, 33, 182, 0.08) 0%, rgba(124, 58, 237, 0.04) 100%)',
    accent: '#5B21B6',
    textOnGradient: '#FFFFFF',
    fallbackImage: '/images/lot-napurak-clasico.jpg',
  },
  seleccion: {
    id: 'seleccion',
    rank: 2,
    stars: '★★',
    priceRangeLabel: '$120–155/kg',
    name: {
      es: 'Selección Especial',
      en: 'Special Selection',
    },
    shortTag: {
      es: 'Especial',
      en: 'Special',
    },
    explainer: {
      es: 'Micro-parcelas de mayor altura o recetas botánicas de tiraje limitado.',
      en: 'Higher-altitude micro-plots or small-batch botanical signature recipes.',
    },
    gradient: 'linear-gradient(125deg, #064E3B 0%, #0F766E 55%, #10B981 100%)',
    softBg: 'linear-gradient(135deg, rgba(6, 78, 59, 0.09) 0%, rgba(16, 185, 129, 0.05) 100%)',
    accent: '#0F766E',
    textOnGradient: '#FFFFFF',
    fallbackImage: '/images/lot-bayanes-seleccion.jpg',
  },
  reserva: {
    id: 'reserva',
    rank: 3,
    stars: '★★★',
    priceRangeLabel: '$160–210/kg',
    name: {
      es: 'Reserva Rara',
      en: 'Rare Reserve',
    },
    shortTag: {
      es: 'Reserva',
      en: 'Reserve',
    },
    explainer: {
      es: 'Genética Nacional relicta escasa con notas excepcionales y muy pocos kilos.',
      en: 'Scarce heirloom Nacional genetics with extraordinary notes and very few kilos.',
    },
    gradient: 'linear-gradient(125deg, #4C0519 0%, #9F1239 50%, #D97706 100%)',
    softBg: 'linear-gradient(135deg, rgba(159, 18, 57, 0.09) 0%, rgba(217, 119, 6, 0.06) 100%)',
    accent: '#9F1239',
    textOnGradient: '#FFFFFF',
    fallbackImage: '/images/ruby-lavender-elixir.jpg',
  },
  edicion: {
    id: 'edicion',
    rank: 4,
    stars: '★★★★',
    priceRangeLabel: '$215+/kg',
    name: {
      es: 'Edición de Colección',
      en: "Collector's Edition",
    },
    shortTag: {
      es: 'Colección',
      en: 'Collector',
    },
    explainer: {
      es: 'Micro-lotes irrepetibles de árboles centenarios seleccionados grano a grano.',
      en: 'One-of-a-kind micro-lots from century-old trees selected bean by bean.',
    },
    gradient: 'linear-gradient(125deg, #1E1B4B 0%, #854D0E 52%, #CA8A04 100%)',
    softBg: 'linear-gradient(135deg, rgba(30, 27, 75, 0.09) 0%, rgba(202, 138, 4, 0.08) 100%)',
    accent: '#A16207',
    textOnGradient: '#FFFFFF',
    fallbackImage: '/images/glassy-fracture.jpg',
  },
};

export function resolveLotCategoryIdByPrice(pricePerKgUsd: number): LotCategoryId {
  if (pricePerKgUsd > 210) return 'edicion';
  if (pricePerKgUsd > 155) return 'reserva';
  if (pricePerKgUsd > 115) return 'seleccion';
  return 'clasico';
}

export function resolveLotCategory(
  lot: Pick<InventoryLot, 'category' | 'pricePerKgUsd'>,
  config: Pick<InventoryConfig, 'pricePerGramUsd'>,
): LotCategoryMeta {
  if (lot.category && lot.category in LOT_CATEGORIES) {
    return LOT_CATEGORIES[lot.category];
  }
  const pricePerKg = resolveLotPricePerKg(lot, config);
  return LOT_CATEGORIES[resolveLotCategoryIdByPrice(pricePerKg)];
}

export function resolveLotImageUrl(
  lot: Pick<InventoryLot, 'imageUrl' | 'category' | 'pricePerKgUsd' | 'incaTrailLot'>,
  config: Pick<InventoryConfig, 'pricePerGramUsd'>,
): string {
  if (lot.imageUrl?.trim()) return lot.imageUrl.trim();
  if (lot.incaTrailLot?.heroImageUrl?.trim()) return lot.incaTrailLot.heroImageUrl.trim();
  return resolveLotCategory(lot, config).fallbackImage;
}

const GENERIC_BASE_INGREDIENT_PATTERNS = [
  /cacao/i,
  /panela/i,
  /az[uú]car/i,
  /sugar/i,
  /cascarilla/i,
  /hull-free/i,
];

function capitalizeFirst(text: string): string {
  if (!text) return '';
  return text.charAt(0).toUpperCase() + text.slice(1);
}

/**
 * Extracts concise, distinctive botanical / recipe highlight pills from a lot formula
 * so customers can tell batches apart in 1 second.
 */
export function extractIngredientHighlights(
  formulaText: string,
  lang: Lang,
  maxItems = 4,
): string[] {
  const normalized = formulaText
    .replace(/\([^)]*\)/g, '')
    .replace(/\s+y\s+/gi, ', ')
    .replace(/\s+&\s+/g, ', ')
    .replace(/\s+and\s+/gi, ', ');

  const rawParts = normalized
    .split(/[,;•·]+/)
    .map((s) => s.trim())
    .filter(Boolean);

  const cacaoMatch = formulaText.match(/\b(\d{2,3}\s*%\s*cacao[^,]*)/i);
  const cacaoBadge = cacaoMatch
    ? `${cacaoMatch[1].match(/\d{2,3}%/)?.[0] ?? '70%'} ${lang === 'es' ? 'cacao vivo' : 'living cacao'}`
    : null;

  const distinctive: string[] = [];
  for (const part of rawParts) {
    const clean = part.replace(/^\d+\s*%\s*/i, '').trim();
    if (!clean || clean.length < 2) continue;
    if (GENERIC_BASE_INGREDIENT_PATTERNS.some((re) => re.test(clean))) continue;
    const label = capitalizeFirst(clean.length > 26 ? `${clean.slice(0, 24).trim()}…` : clean);
    if (!distinctive.some((existing) => existing.toLowerCase() === label.toLowerCase())) {
      distinctive.push(label);
    }
    if (distinctive.length >= maxItems) break;
  }

  if (distinctive.length === 0 && cacaoBadge) {
    return [cacaoBadge];
  }

  return distinctive;
}

export function formatAltitudeFromMeters(altitudeM?: number): string {
  if (typeof altitudeM !== 'number' || !Number.isFinite(altitudeM) || altitudeM <= 0) {
    return '1,150 m s.n.m.';
  }
  return `${Math.round(altitudeM).toLocaleString('en-US')} m s.n.m.`;
}
