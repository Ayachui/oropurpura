import QRCode from 'qrcode';
import type { InventoryBlock, InventoryConfig, InventoryLot } from '../types/inventory';
import { resolveLotCategory } from './lotCategories';
import { formatBlockPrice, resolveLotPricePerGram } from './whatsapp';

function buildTraceUrl(lotId: string, blockId: string): string {
  const origin =
    typeof window !== 'undefined' && window.location.hostname !== 'localhost'
      ? window.location.origin
      : 'https://oropurpura.incatrailfoods.com';
  const params = new URLSearchParams({
    lote: lotId,
    bloque: blockId,
  });
  return `${origin}/trace?${params.toString()}`;
}

function wrapTextLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number,
  maxLines: number,
): string[] {
  const words = text.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return [];

  const lines: string[] = [];
  let current = '';

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (ctx.measureText(candidate).width <= maxWidth) {
      current = candidate;
    } else {
      if (current) {
        lines.push(current);
        if (lines.length >= maxLines) break;
      }
      current = word;
    }
  }

  if (current && lines.length < maxLines) {
    lines.push(current);
  }

  if (lines.length === maxLines && words.join(' ') !== lines.join(' ')) {
    const last = lines[maxLines - 1] || '';
    lines[maxLines - 1] = last.length > 3 ? `${last.slice(0, -3).trim()}…` : `${last}…`;
  }

  return lines;
}

export async function downloadBlockLabelPng(
  lot: InventoryLot,
  block: InventoryBlock,
  config: Pick<InventoryConfig, 'pricePerGramUsd'>,
): Promise<void> {
  const size = 1200; // 10x10 cm @ ~300 DPI
  const pad = 56;
  const innerW = size - pad * 2;

  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('No se pudo inicializar el lienzo 2D para exportar PNG.');
  }

  const category = resolveLotCategory(lot, config);
  const lotPricePerGram = resolveLotPricePerGram(lot, config);
  const priceFormatted = formatBlockPrice(block.weight_g, lotPricePerGram);
  const harvestLabel = typeof lot.harvestDate === 'string' ? lot.harvestDate : lot.harvestDate.es;
  const originLabel = lot.incaTrailLot?.community || lot.origin.es;
  const rawBatchCode = lot.incaTrailLot?.sourceBatchId || lot.lotId;
  const traceUrl = buildTraceUrl(lot.lotId, block.blockId);

  // Background & outer border
  ctx.fillStyle = '#FAF9FC';
  ctx.fillRect(0, 0, size, size);
  ctx.strokeStyle = '#121016';
  ctx.lineWidth = 10;
  ctx.strokeRect(5, 5, size - 10, size - 10);

  // Top category accent bar
  ctx.fillStyle = category.accent;
  ctx.fillRect(10, 10, size - 20, 14);

  // Header band
  let y = pad + 18;
  ctx.fillStyle = '#3B0764';
  ctx.font = '800 54px "Syne", "Montserrat", sans-serif';
  ctx.fillText('ORO PÚRPURA', pad, y + 42);

  ctx.fillStyle = '#524D5C';
  ctx.font = '600 22px "IBM Plex Mono", monospace';
  ctx.fillText('ORIGEN 5300 • ZAMORA, ECUADOR', pad, y + 76);

  // Right lot/block badge
  const badgeW = 280;
  const badgeH = 92;
  const badgeX = size - pad - badgeW;
  ctx.fillStyle = '#121016';
  ctx.fillRect(badgeX, y - 4, badgeW, badgeH);

  ctx.fillStyle = '#F4F2F7';
  ctx.font = '700 26px "IBM Plex Mono", monospace';
  ctx.textAlign = 'right';
  ctx.fillText(lot.lotId, size - pad - 18, y + 32);
  ctx.fillStyle = '#E9D5FF';
  ctx.font = '700 24px "IBM Plex Mono", monospace';
  ctx.fillText(block.blockId, size - pad - 18, y + 68);
  ctx.textAlign = 'left';

  // Category pill
  y += 108;
  const catText = `${category.stars} ${category.name.es.toUpperCase()}`;
  ctx.font = '700 22px "IBM Plex Mono", monospace';
  const catPillW = Math.min(innerW, ctx.measureText(catText).width + 36);
  ctx.fillStyle = category.accent;
  ctx.fillRect(pad, y, catPillW, 40);
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText(catText, pad + 18, y + 27);

  // Divider
  y += 58;
  ctx.strokeStyle = '#121016';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(size - pad, y);
  ctx.stroke();

  // Middle grid: Weight/Price on left, QR on right
  y += 34;
  const qrSize = 310;
  const qrX = size - pad - qrSize;
  const qrY = y + 4;

  ctx.fillStyle = '#524D5C';
  ctx.font = '700 22px "IBM Plex Mono", monospace';
  ctx.fillText('PESO NETO REAL', pad, y + 22);

  ctx.fillStyle = '#121016';
  ctx.font = '800 132px "Syne", sans-serif';
  const weightStr = `${block.weight_g}`;
  ctx.fillText(weightStr, pad, y + 148);
  const weightWidth = ctx.measureText(weightStr).width;

  ctx.fillStyle = '#3B0764';
  ctx.font = '800 68px "Syne", sans-serif';
  ctx.fillText('g', pad + weightWidth + 14, y + 148);

  ctx.fillStyle = '#3B0764';
  ctx.font = '700 44px "IBM Plex Mono", monospace';
  ctx.fillText(`${priceFormatted} USD`, pad, y + 218);

  ctx.fillStyle = '#065F46';
  ctx.font = '700 22px "IBM Plex Mono", monospace';
  ctx.fillText('0% FERMENTACIÓN • 0% TUESTE', pad, y + 266);

  // Render QR onto offscreen canvas and draw
  const qrCanvas = document.createElement('canvas');
  await QRCode.toCanvas(qrCanvas, traceUrl, {
    width: qrSize,
    margin: 1,
    color: {
      dark: '#121016',
      light: '#FAF9FC',
    },
  });
  ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
  ctx.strokeStyle = '#121016';
  ctx.lineWidth = 3;
  ctx.strokeRect(qrX, qrY, qrSize, qrSize);

  ctx.fillStyle = '#121016';
  ctx.font = '700 19px "IBM Plex Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('ESCANEAR TRAZABILIDAD', qrX + qrSize / 2, qrY + qrSize + 28);
  ctx.textAlign = 'left';

  // Divider below middle grid
  y += 364;
  ctx.strokeStyle = 'rgba(18, 16, 22, 0.28)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, y);
  ctx.lineTo(size - pad, y);
  ctx.stroke();

  // Formula box
  y += 32;
  ctx.fillStyle = '#524D5C';
  ctx.font = '700 21px "IBM Plex Mono", monospace';
  ctx.fillText('INGREDIENTES / FÓRMULA:', pad, y);

  y += 34;
  ctx.fillStyle = '#121016';
  ctx.font = '500 25px "IBM Plex Sans", sans-serif';
  const formulaLines = wrapTextLines(ctx, lot.formula.es, innerW, 4);
  for (const line of formulaLines) {
    ctx.fillText(line, pad, y);
    y += 34;
  }

  // Divider above footer
  const footerTop = size - pad - 150;
  ctx.strokeStyle = 'rgba(18, 16, 22, 0.28)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(pad, footerTop);
  ctx.lineTo(size - pad, footerTop);
  ctx.stroke();

  // Footer lines
  const drawFooterLine = (label: string, value: string, lineY: number) => {
    ctx.font = '700 21px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#3B0764';
    ctx.fillText(label, pad, lineY);
    const labelW = ctx.measureText(`${label} `).width;
    ctx.font = '500 21px "IBM Plex Mono", monospace';
    ctx.fillStyle = '#121016';
    const [fit] = wrapTextLines(ctx, value, innerW - labelW, 1);
    if (fit) ctx.fillText(fit, pad + labelW, lineY);
  };

  drawFooterLine('ORIGEN:', originLabel, footerTop + 38);
  drawFooterLine('LOTE INCA TRAIL:', `${rawBatchCode} • ${harvestLabel}`, footerTop + 76);
  drawFooterLine(
    'USO:',
    'Cortar virutas (20 g / 180 ml agua 72–75 °C)',
    footerTop + 114,
  );

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob((b) => resolve(b), 'image/png'),
  );
  if (!blob) {
    throw new Error('No se pudo generar el archivo PNG.');
  }

  const safeLot = lot.lotId.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  const safeBlock = block.blockId.replace(/[^a-zA-Z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  const filename = `oro-purpura-${safeLot}-${safeBlock}-${block.weight_g}g.png`;

  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
