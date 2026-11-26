import { useEffect, useState } from 'react';
import type { IncaTrailLotLink, InventoryBlock, InventoryData, InventoryLot } from '../types/inventory';
import { fetchIncaTrailLots } from '../utils/incaTrailLots';
import { formatBlockPrice } from '../utils/whatsapp';
import { LabelPrintModal } from './LabelPrintModal';

interface AdminViewProps {
  inventory: InventoryData;
  onSaveInventory: (next: InventoryData) => void;
  onResetToDefault: () => void;
  onBackToHome: () => void;
  onGoToShop: () => void;
}

function parseWeightList(raw: string, extraFields: string[]): number[] {
  const fromComma = raw
    .split(/[\s,;]+/)
    .map((s) => Number.parseInt(s.replace(/[^\d]/g, ''), 10))
    .filter((n) => Number.isFinite(n) && n > 0);

  const fromFields = extraFields
    .map((s) => Number.parseInt(s.replace(/[^\d]/g, ''), 10))
    .filter((n) => Number.isFinite(n) && n > 0);

  return [...fromComma, ...fromFields];
}

export function AdminView({
  inventory,
  onSaveInventory,
  onResetToDefault,
  onBackToHome,
  onGoToShop,
}: AdminViewProps) {
  const [incaLots, setIncaLots] = useState<IncaTrailLotLink[]>([]);
  const [lotsSource, setLotsSource] = useState<'loading' | 'api' | 'fallback'>('loading');
  const [selectedIncaId, setSelectedIncaId] = useState<string>('');
  const [customTitle, setCustomTitle] = useState<string>('');
  const [recipeText, setRecipeText] = useState<string>(
    inventory.lots[0]?.formula.es ||
      '70% cacao púrpura vivo pelado (sin cascarilla), panela orgánica, sal marina',
  );
  const [weightsCsv, setWeightsCsv] = useState<string>('');
  const [extraWeights, setExtraWeights] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  const [printTarget, setPrintTarget] = useState<{
    lot: InventoryLot;
    block: InventoryBlock;
  } | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    void fetchIncaTrailLots(inventory.lots, controller.signal).then(({ lots, source }) => {
      setIncaLots(lots);
      setLotsSource(source);
      if (lots[0] && !selectedIncaId) {
        setSelectedIncaId(lots[0].sourceBatchId);
      }
    });
    return () => controller.abort();
  }, [inventory.lots, selectedIncaId]);

  const selectedIncaLot =
    incaLots.find((l) => l.sourceBatchId === selectedIncaId) ?? incaLots[0] ?? null;

  const parsedWeights = parseWeightList(weightsCsv, extraWeights);

  const nextLotNumber = inventory.lots.length + 1;
  const nextLotId = `LOTE #${String(nextLotNumber).padStart(2, '0')}`;

  const handleAddProduction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIncaLot || parsedWeights.length === 0 || !recipeText.trim()) return;

    const lotTitle = customTitle.trim() || selectedIncaLot.title;
    const lotShortNum = String(nextLotNumber).padStart(2, '0');

    const newBlocks: InventoryBlock[] = parsedWeights.map((w, idx) => ({
      blockId: `#${lotShortNum}-${String(idx + 1).padStart(2, '0')}`,
      weight_g: w,
      status: 'disponible',
    }));

    const newLot: InventoryLot = {
      lotId: nextLotId,
      active: true,
      title: {
        es: lotTitle,
        en: lotTitle,
      },
      origin: {
        es: selectedIncaLot.community || 'Zamora-Chinchipe, Ecuador',
        en: selectedIncaLot.community || 'Zamora-Chinchipe, Ecuador',
      },
      altitude: '1,150 m s.n.m.',
      harvestDate: selectedIncaLot.harvestDate || 'Noviembre 2026',
      tastingNotes: {
        es: 'Cacao púrpura vivo sin fermentar ni tostar',
        en: 'Unfermented, unroasted living purple cacao',
      },
      formula: {
        es: recipeText.trim(),
        en: recipeText.trim(),
      },
      tznk: {
        badge: 'TZNK VERIFIED • INCA TRAIL',
        url: selectedIncaLot.traceUrl || 'https://www.incatrailfoods.com/products',
      },
      incaTrailLot: selectedIncaLot,
      blocks: newBlocks,
    };

    onSaveInventory({
      ...inventory,
      lots: [newLot, ...inventory.lots],
    });

    setWeightsCsv('');
    setExtraWeights([]);
    setCustomTitle('');
    setFeedbackMsg(
      `✓ ${newLot.lotId} creado con ${newBlocks.length} bloques disponibles en la tienda.`,
    );
    window.setTimeout(() => setFeedbackMsg(''), 4500);
  };

  const handleToggleBlockStatus = (lotId: string, blockId: string) => {
    const updatedLots = inventory.lots.map((lot) => {
      if (lot.lotId !== lotId) return lot;
      return {
        ...lot,
        blocks: lot.blocks.map((b) =>
          b.blockId === blockId
            ? {
                ...b,
                status: (b.status === 'disponible' ? 'vendido' : 'disponible') as
                  | 'disponible'
                  | 'vendido',
              }
            : b,
        ),
      };
    });

    onSaveInventory({
      ...inventory,
      lots: updatedLots,
    });
  };

  const handleDeleteLot = (lotId: string) => {
    onSaveInventory({
      ...inventory,
      lots: inventory.lots.filter((l) => l.lotId !== lotId),
    });
  };

  const handleExportJson = () => {
    const blob = new Blob([JSON.stringify(inventory, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'inventory.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <section className="section admin-page">
      <div className="container">
        <div className="storefront-page-bar">
          <button type="button" className="btn-back-home mono" onClick={onBackToHome}>
            ← Volver al inicio
          </button>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <button type="button" className="btn-back-home mono" onClick={onGoToShop}>
              Ver tienda (/bloques) →
            </button>
          </div>
        </div>

        <div className="section-header">
          <p className="eyebrow">PANEL DE PRODUCCIÓN • ORO PÚRPURA</p>
          <h1 className="storefront-h1">Admin de Stock, Lotes y Etiquetas 10×10</h1>
          <p className="section-subtitle">
            Agrega nuevos bloques desde los lotes de Inca Trail Foods, marca bloques vendidos y
            imprime etiquetas 10×10 cm con QR de trazabilidad.
          </p>
        </div>

        {/* SECTION 1: Agregar Producción al Stock */}
        <form className="admin-card" onSubmit={handleAddProduction}>
          <div className="admin-card-head">
            <div>
              <span className="mono admin-step-tag">01 // AGREGAR PRODUCCIÓN AL STOCK</span>
              <h2 className="admin-card-title">Nuevo lote de bloques ({nextLotId})</h2>
            </div>
            <span className="mono admin-source-pill">
              {lotsSource === 'api'
                ? '● Conectado a Inca Trail API'
                : lotsSource === 'loading'
                  ? 'Cargando lotes...'
                  : '● Modo local (Inca Trail cache)'}
            </span>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="inca-lot-select" className="mono admin-label">
                1. Lote de cacao (Inca Trail Foods — activos y vendidos)
              </label>
              <select
                id="inca-lot-select"
                className="admin-input"
                value={selectedIncaId}
                onChange={(e) => setSelectedIncaId(e.target.value)}
              >
                {incaLots.map((lot) => (
                  <option key={lot.sourceBatchId} value={lot.sourceBatchId}>
                    {lot.sourceBatchId} — {lot.title}
                    {lot.community ? ` (${lot.community})` : ''}
                  </option>
                ))}
              </select>
            </div>

            <div className="admin-field">
              <label htmlFor="lot-custom-title" className="mono admin-label">
                Nombre de la partida (opcional)
              </label>
              <input
                id="lot-custom-title"
                type="text"
                className="admin-input"
                placeholder={selectedIncaLot?.title || 'Ej. Cosecha Napurak — Sinergia INCA'}
                value={customTitle}
                onChange={(e) => setCustomTitle(e.target.value)}
              />
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="recipe-input" className="mono admin-label">
                2. Receta / Fórmula (copiar desde calculadora)
              </label>
              <textarea
                id="recipe-input"
                rows={3}
                className="admin-input"
                value={recipeText}
                onChange={(e) => setRecipeText(e.target.value)}
                placeholder="Pega aquí la receta exacta de la calculadora..."
                required
              />
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="weights-csv" className="mono admin-label">
                3. Gramaje de los bloques (separados por coma, ej: 178, 186, 150)
              </label>
              <div className="admin-weights-row">
                <input
                  id="weights-csv"
                  type="text"
                  className="admin-input"
                  placeholder="178, 186, 150, 340"
                  value={weightsCsv}
                  onChange={(e) => setWeightsCsv(e.target.value)}
                />
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setExtraWeights((prev) => [...prev, ''])}
                >
                  + Campo individual
                </button>
              </div>

              {extraWeights.length > 0 && (
                <div className="admin-extra-weights">
                  {extraWeights.map((val, i) => (
                    <div key={i} className="admin-extra-weight-chip">
                      <input
                        type="number"
                        min={1}
                        className="admin-input admin-input-sm"
                        placeholder="g"
                        value={val}
                        onChange={(e) => {
                          const next = [...extraWeights];
                          next[i] = e.target.value;
                          setExtraWeights(next);
                        }}
                      />
                      <button
                        type="button"
                        className="btn-remove-sm"
                        aria-label="Quitar"
                        onClick={() =>
                          setExtraWeights((prev) => prev.filter((_, idx) => idx !== i))
                        }
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {parsedWeights.length > 0 && (
                <div className="admin-preview-chips">
                  {parsedWeights.map((w, idx) => (
                    <span key={`${w}-${idx}`} className="admin-preview-chip mono">
                      #{String(nextLotNumber).padStart(2, '0')}-{String(idx + 1).padStart(2, '0')} •{' '}
                      {w} g • {formatBlockPrice(w, inventory.config.pricePerGramUsd)}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="admin-form-footer">
            <button
              type="submit"
              className="btn btn-primary"
              disabled={parsedWeights.length === 0 || !recipeText.trim()}
            >
              Agregar {parsedWeights.length || ''} bloques al stock →
            </button>
            {feedbackMsg && <span className="admin-feedback mono">{feedbackMsg}</span>}
          </div>
        </form>

        {/* SECTION 2: Lista de Inventario, Vendidos & Etiquetas 10x10 */}
        <div className="admin-card" style={{ marginTop: '28px' }}>
          <div className="admin-card-head">
            <div>
              <span className="mono admin-step-tag">02 // STOCK ACTUAL Y ETIQUETAS 10×10 CM</span>
              <h2 className="admin-card-title">Todos los lotes y bloques</h2>
            </div>
            <div className="admin-tools-row">
              <button type="button" className="btn-back-home mono" onClick={handleExportJson}>
                Exportar inventory.json
              </button>
              <button type="button" className="btn-back-home mono" onClick={onResetToDefault}>
                Restaurar base
              </button>
            </div>
          </div>

          <div className="admin-lots-list">
            {inventory.lots.map((lot) => {
              const availCount = lot.blocks.filter((b) => b.status === 'disponible').length;
              return (
                <div key={lot.lotId} className="admin-lot-group">
                  <div className="admin-lot-header">
                    <div>
                      <span className="lot-id-badge">{lot.lotId}</span>
                      <strong className="admin-lot-title">{lot.title.es}</strong>
                      <span className="mono admin-lot-count">
                        ({availCount}/{lot.blocks.length} disp.)
                      </span>
                    </div>
                    <button
                      type="button"
                      className="btn-delete-lot mono"
                      onClick={() => handleDeleteLot(lot.lotId)}
                    >
                      Eliminar lote
                    </button>
                  </div>

                  <p className="admin-lot-formula">{lot.formula.es}</p>

                  <div className="admin-blocks-table">
                    {lot.blocks.map((block) => {
                      const isAvail = block.status === 'disponible';
                      return (
                        <div
                          key={`${lot.lotId}-${block.blockId}`}
                          className={`admin-block-row ${isAvail ? '' : 'is-sold'}`}
                        >
                          <div className="admin-block-info">
                            <span className="mono admin-block-id">{block.blockId}</span>
                            <span className="admin-block-weight">{block.weight_g} g</span>
                            <span className="mono admin-block-price">
                              {formatBlockPrice(block.weight_g, inventory.config.pricePerGramUsd)}
                            </span>
                            <span
                              className={`block-status-badge mono ${
                                isAvail ? 'status-available' : 'status-sold'
                              }`}
                            >
                              {isAvail ? 'DISPONIBLE' : 'VENDIDO'}
                            </span>
                          </div>

                          <div className="admin-block-actions">
                            <button
                              type="button"
                              className={`btn-toggle-status mono ${isAvail ? '' : 'is-sold'}`}
                              onClick={() => handleToggleBlockStatus(lot.lotId, block.blockId)}
                            >
                              {isAvail ? 'Marcar vendido' : 'Marcar disponible'}
                            </button>
                            <button
                              type="button"
                              className="btn-print-label mono"
                              onClick={() => setPrintTarget({ lot, block })}
                            >
                              Etiqueta 10×10 🖨
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <LabelPrintModal
        lot={printTarget?.lot ?? null}
        block={printTarget?.block ?? null}
        pricePerGramUsd={inventory.config.pricePerGramUsd}
        onClose={() => setPrintTarget(null)}
      />
    </section>
  );
}
