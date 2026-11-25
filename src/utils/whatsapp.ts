import type { Lang } from '../types/inventory';

export const DEFAULT_WHATSAPP_PHONE = '593982873007';

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
}

export function buildBlockWhatsAppMessage(params: Omit<BlockWhatsAppParams, 'phone'>): string {
  if (params.lang === 'es') {
    return `¡Hola ORO PÚRPURA! Quiero reservar el Bloque ${params.blockId} (${params.weight_g} g — ${params.priceFormatted}) del ${params.lotId} (${params.lotTitle}). Mi ciudad para calcular el envío Servientrega es: `;
  }
  return `Hello ORO PÚRPURA! I would like to reserve Block ${params.blockId} (${params.weight_g} g — ${params.priceFormatted}) from ${params.lotId} (${params.lotTitle}). My city for Servientrega shipping calculation is: `;
}

export function buildBlockWhatsAppUrl(params: BlockWhatsAppParams): string {
  const message = buildBlockWhatsAppMessage(params);
  return buildWhatsAppUrl(params.phone, message);
}

export function buildB2BWhatsAppMessage(lang: Lang, pricePerKg = 60, minKg = 3): string {
  if (lang === 'es') {
    return `¡Hola Eugenio / ORO PÚRPURA! Me interesa el programa B2B ($${pricePerKg}/kg desde ${minKg} kg/mes) para mi cafetería, tienda o centro de retiro en: `;
  }
  return `Hello Eugenio / ORO PÚRPURA! I am interested in the B2B program ($${pricePerKg}/kg starting at ${minKg} kg/month) for my café, store, or retreat center in: `;
}

export function buildB2BWhatsAppUrl(
  phone: string,
  lang: Lang,
  pricePerKg = 60,
  minKg = 3,
): string {
  return buildWhatsAppUrl(phone, buildB2BWhatsAppMessage(lang, pricePerKg, minKg));
}

export function buildGeneralWhatsAppMessage(lang: Lang): string {
  if (lang === 'es') {
    return '¡Hola ORO PÚRPURA! Quiero consultar los bloques disponibles de cacao púrpura vivo ($100/kg) y coordinar envío Servientrega a mi ciudad: ';
  }
  return 'Hello ORO PÚRPURA! I would like to check available living purple cacao blocks ($100/kg) and coordinate Servientrega shipping to my city: ';
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
