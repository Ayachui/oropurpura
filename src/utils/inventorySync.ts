import type { BlockStatus, InventoryBlock, InventoryData } from '../types/inventory';

interface SheetBlockRow {
  lotId: string;
  blockId: string;
  weight_g: number;
  status: BlockStatus;
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i += 1;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

function normalizeStatus(raw: string): BlockStatus | null {
  const value = raw.trim().toLowerCase();
  if (value === 'disponible' || value === 'available' || value === 'activo') {
    return 'disponible';
  }
  if (value === 'vendido' || value === 'sold' || value === 'reservado' || value === 'reserved') {
    return 'vendido';
  }
  return null;
}

export function parseInventoryCsv(csvText: string): SheetBlockRow[] {
  const lines = csvText
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase().replace(/\s+/g, ''));
  const idxLot = headers.findIndex((h) => h === 'lotid' || h === 'lot_id' || h === 'lote');
  const idxBlock = headers.findIndex((h) => h === 'blockid' || h === 'block_id' || h === 'bloque');
  const idxWeight = headers.findIndex((h) => h === 'weight_g' || h === 'weight' || h === 'peso_g' || h === 'peso');
  const idxStatus = headers.findIndex((h) => h === 'status' || h === 'estado');

  if (idxLot === -1 || idxBlock === -1 || idxWeight === -1 || idxStatus === -1) {
    return [];
  }

  const rows: SheetBlockRow[] = [];
  for (let i = 1; i < lines.length; i += 1) {
    const cols = parseCsvLine(lines[i]);
    const lotId = cols[idxLot]?.trim();
    const blockId = cols[idxBlock]?.trim();
    const weightNum = Number.parseFloat((cols[idxWeight] || '').replace(/[^\d.]/g, ''));
    const status = normalizeStatus(cols[idxStatus] || '');

    if (!lotId || !blockId || !Number.isFinite(weightNum) || weightNum <= 0 || !status) {
      continue;
    }

    rows.push({
      lotId,
      blockId,
      weight_g: Math.round(weightNum),
      status,
    });
  }

  return rows;
}

export function mergeSheetRowsIntoInventory(
  base: InventoryData,
  rows: SheetBlockRow[],
): InventoryData {
  if (rows.length === 0) return base;

  const grouped = new Map<string, InventoryBlock[]>();
  for (const row of rows) {
    const key = row.lotId.toUpperCase();
    const list = grouped.get(key) ?? [];
    list.push({
      blockId: row.blockId,
      weight_g: row.weight_g,
      status: row.status,
    });
    grouped.set(key, list);
  }

  const updatedLots = base.lots.map((lot) => {
    const overrideBlocks = grouped.get(lot.lotId.toUpperCase());
    if (!overrideBlocks || overrideBlocks.length === 0) {
      return lot;
    }
    return {
      ...lot,
      blocks: overrideBlocks,
    };
  });

  return {
    ...base,
    lots: updatedLots,
  };
}

export async function fetchInventoryOverride(
  base: InventoryData,
  signal?: AbortSignal,
): Promise<{ data: InventoryData; syncedFromSheets: boolean }> {
  const csvUrl = base.config.googleSheetsCsvUrl?.trim();
  if (!csvUrl) {
    return { data: base, syncedFromSheets: false };
  }

  try {
    const res = await fetch(csvUrl, { cache: 'no-store', signal });
    if (!res.ok) {
      return { data: base, syncedFromSheets: false };
    }
    const text = await res.text();
    const rows = parseInventoryCsv(text);
    if (rows.length === 0) {
      return { data: base, syncedFromSheets: false };
    }
    return {
      data: mergeSheetRowsIntoInventory(base, rows),
      syncedFromSheets: true,
    };
  } catch {
    return { data: base, syncedFromSheets: false };
  }
}
