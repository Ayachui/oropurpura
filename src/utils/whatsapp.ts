import type { InventoryConfig, InventoryLot, Lang, WhatsAppTemplates } from '../types/inventory';

export const DEFAULT_WHATSAPP_PHONE = '593982873007';

export const DEFAULT_WHATSAPP_TEMPLATES: WhatsAppTemplates = {
  blockEs:
    '¡Hola ORO PÚRPURA! Quiero reservar el Bloque {blockId} ({weight_g} g — {price}) del {lotId} ({lotTitle}). Mi ciudad para calcular el envío Servientrega es: ',
  blockEn:
    'Hello ORO PÚRPURA! I would like to reserve Block {blockId} ({weight_g} g — {price}) from {lotId} ({lotTitle}). My city for Servientrega shipping calculation is: ',
  b2bEs:
    '¡Hola Eugenio / ORO PÚRPURA! Me interesa el programa B2B ({b2bDiscount}% de descuento desde {b2bMin} kg/mes) para mi cafetería, tienda o centro de retiro en: ',
  b2bEn:
    'Hello Eugenio / ORO PÚRPURA! I am interested in the B2B program ({b2bDiscount}% discount starting at {b2bMin} kg/month) for my café, store, or retreat center in: ',
  generalEs:
    '¡Hola ORO PÚRPURA! Quiero consultar los bloques disponibles de cacao púrpura vivo y coordinar envío Servientrega a mi ciudad: ',
  generalEn:
    'Hello ORO PÚRPURA! I would like to check available living purple cacao blocks and coordinate Servientrega shipping to my city: ',
};

export function resolveLotPricePerKg(
  lot: Pick<InventoryLot, 'pricePerKgUsd'>,
  config: Pick<InventoryConfig, 'pricePerGramUsd'>,
): number {
  if (typeof lot.pricePerKgUsd === 'number' && Number.isFinite(lot.pricePerKgUsd) && lot.pricePerKgUsd > 0) {
    return lot.pricePerKgUsd;
  }
  return Math.round(config.pricePerGramUsd * 1000 * 100) / 100;
}

export function resolveLotPricePerGram(
  lot: Pick<InventoryLot, 'pricePerKgUsd'>,
  config: Pick<InventoryConfig, 'pricePerGramUsd'>,
): number {
  return resolveLotPricePerKg(lot, config) / 1000;
}

export function formatBlockPrice(weightGrams: number, pricePerGram = 0.1): string {
  const price = Math.round(weightGrams * pricePerGram * 100) / 100;
  return `$${price.toFixed(2)}`;
}

export function buildWhatsAppUrl(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^\d]/g, '') || DEFAULT_WHATSAPP_PHONE;
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

export interface BlockWhatsAppParams {
  phone: string;
  lang: Lang;
  lotId: string;
  lotTitle: string;
  blockId: string;
  weight_g: number;
  priceFormatted: string;
  templates?: Partial<WhatsAppTemplates>;
}

export function buildBlockWhatsAppMessage(params: Omit<BlockWhatsAppParams, 'phone'>): string {
  const tpl =
    params.lang === 'es'
      ? params.templates?.blockEs?.trim() || DEFAULT_WHATSAPP_TEMPLATES.blockEs
      : params.templates?.blockEn?.trim() || DEFAULT_WHATSAPP_TEMPLATES.blockEn;

  return tpl
    .replace(/\{blockId\}/g, params.blockId)
    .replace(/\{weight_g\}/g, String(params.weight_g))
    .replace(/\{price\}/g, params.priceFormatted)
    .replace(/\{lotId\}/g, params.lotId)
    .replace(/\{lotTitle\}/g, params.lotTitle);
}

export function buildB2BWhatsAppMessage(
  lang: Lang,
  discountPercent = 40,
  minKg = 3,
  templates?: Partial<WhatsAppTemplates>,
): string {
  const tpl =
    lang === 'es'
      ? templates?.b2bEs?.trim() || DEFAULT_WHATSAPP_TEMPLATES.b2bEs
      : templates?.b2bEn?.trim() || DEFAULT_WHATSAPP_TEMPLATES.b2bEn;

  return tpl
    .replace(/\{b2bDiscount\}/g, String(discountPercent))
    .replace(/\{b2bMin\}/g, String(minKg));
}

export function buildGeneralWhatsAppMessage(
  lang: Lang,
  templates?: Partial<WhatsAppTemplates>,
): string {
  return lang === 'es'
    ? templates?.generalEs?.trim() || DEFAULT_WHATSAPP_TEMPLATES.generalEs
    : templates?.generalEn?.trim() || DEFAULT_WHATSAPP_TEMPLATES.generalEn;
}

export async function copyOrderText(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    const textarea = document.createElement('textarea');
    textarea.value = text;
    textarea.style.position = 'fixed';
    textarea.style.opacity = '0';
    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();
    const ok = document.execCommand('copy');
    document.body.removeChild(textarea);
    return ok;
  } catch {
    return false;
  }
}
