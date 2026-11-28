import { useEffect, useState } from 'react';
import { CONTENT } from '../data/content';
import type { IncaTrailLotLink, InventoryBlock, InventoryData, InventoryLot } from '../types/inventory';
import { fetchIncaTrailLots } from '../utils/incaTrailLots';
import {
  DEFAULT_WHATSAPP_TEMPLATES,
  formatBlockPrice,
  resolveLotPricePerGram,
  resolveLotPricePerKg,
} from '../utils/whatsapp';
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
  const [lotPricePerKgInput, setLotPricePerKgInput] = useState<string>(
    String(Math.round(inventory.config.pricePerGramUsd * 1000)),
  );
  const [recipeText, setRecipeText] = useState<string>(
    inventory.lots[0]?.formula.es ||
      '70% cacao púrpura vivo pelado (sin cascarilla), panela orgánica, sal marina',
  );
  const [weightsCsv, setWeightsCsv] = useState<string>('');
  const [extraWeights, setExtraWeights] = useState<string[]>([]);
  const [feedbackMsg, setFeedbackMsg] = useState<string>('');

  // Section 03: Variables & Settings state
  const [whatsappPhone, setWhatsappPhone] = useState(inventory.config.whatsappPhone);
  const [pricePerGram, setPricePerGram] = useState(String(inventory.config.pricePerGramUsd));
  const [b2bDiscount, setB2bDiscount] = useState(
    String(inventory.config.b2bDiscountPercent ?? 40),
  );
  const [b2bMinKg, setB2bMinKg] = useState(String(inventory.config.b2bMinKgPerMonth));
  const [sheetsUrl, setSheetsUrl] = useState(inventory.config.googleSheetsCsvUrl || '');

  const [tplBlockEs, setTplBlockEs] = useState(
    inventory.config.whatsappTemplates?.blockEs || DEFAULT_WHATSAPP_TEMPLATES.blockEs,
  );
  const [tplBlockEn, setTplBlockEn] = useState(
    inventory.config.whatsappTemplates?.blockEn || DEFAULT_WHATSAPP_TEMPLATES.blockEn,
  );
  const [tplB2bEs, setTplB2bEs] = useState(
    inventory.config.whatsappTemplates?.b2bEs || DEFAULT_WHATSAPP_TEMPLATES.b2bEs,
  );
  const [tplGeneralEs, setTplGeneralEs] = useState(
    inventory.config.whatsappTemplates?.generalEs || DEFAULT_WHATSAPP_TEMPLATES.generalEs,
  );

  const [shippingTitleEs, setShippingTitleEs] = useState(
    inventory.config.logistics?.shippingTitleEs || CONTENT.es.logistics.shippingTitle,
  );
  const [shippingBodyEs, setShippingBodyEs] = useState(
    inventory.config.logistics?.shippingBodyEs || CONTENT.es.logistics.shippingBody,
  );
  const [paymentsTitleEs, setPaymentsTitleEs] = useState(
    inventory.config.logistics?.paymentsTitleEs || CONTENT.es.logistics.paymentsTitle,
  );
  const [paymentsSummaryEs, setPaymentsSummaryEs] = useState(
    inventory.config.logistics?.paymentsSummaryEs || CONTENT.es.logistics.paymentsSummary,
  );
  const [paymentsSummaryEn, setPaymentsSummaryEn] = useState(
    inventory.config.logistics?.paymentsSummaryEn || CONTENT.en.logistics.paymentsSummary,
  );
  const [settingsSavedMsg, setSettingsSavedMsg] = useState('');

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
  const parsedLotPricePerKg = (() => {
    const n = Number.parseFloat(lotPricePerKgInput);
    return Number.isFinite(n) && n > 0 ? n : inventory.config.pricePerGramUsd * 1000;
  })();
  const lotPricePerGramPreview = parsedLotPricePerKg / 1000;

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
      pricePerKgUsd: parsedLotPricePerKg,
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
      `✓ ${newLot.lotId} creado ($${parsedLotPricePerKg}/kg) con ${newBlocks.length} bloques disponibles.`,
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
              <label htmlFor="lot-price-kg" className="mono admin-label">
                2. Precio por kg de este lote ($ USD / kg)
              </label>
              <input
                id="lot-price-kg"
                type="number"
                step="1"
                min="1"
                className="admin-input mono"
                value={lotPricePerKgInput}
                onChange={(e) => setLotPricePerKgInput(e.target.value)}
                placeholder="100"
                required
              />
            </div>

            <div className="admin-field admin-field-full">
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
                3. Receta / Fórmula (copiar desde calculadora)
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
                4. Gramaje de los bloques (separados por coma, ej: 178, 186, 150)
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
                      {w} g • {formatBlockPrice(w, lotPricePerGramPreview)}
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
              const lotPricePerKg = resolveLotPricePerKg(lot, inventory.config);
              const lotPricePerGram = resolveLotPricePerGram(lot, inventory.config);
              return (
                <div key={lot.lotId} className="admin-lot-group">
                  <div className="admin-lot-header">
                    <div>
                      <span className="lot-id-badge">{lot.lotId}</span>
                      <strong className="admin-lot-title">{lot.title.es}</strong>
                      <span className="mono admin-lot-count">
                        ${lotPricePerKg}/kg • ({availCount}/{lot.blocks.length} disp.)
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
                              {formatBlockPrice(block.weight_g, lotPricePerGram)}
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
        {/* SECTION 3: Editor de Variables (WhatsApp, Precios, Mensajes, Pagos, Sheets) */}
        <form
          className="admin-card"
          style={{ marginTop: '28px' }}
          onSubmit={(e) => {
            e.preventDefault();
            const parsedGram = Number.parseFloat(pricePerGram);
            const parsedDiscount = Number.parseFloat(b2bDiscount);
            const parsedMin = Number.parseFloat(b2bMinKg);

            onSaveInventory({
              ...inventory,
              config: {
                ...inventory.config,
                whatsappPhone: whatsappPhone.replace(/[^\d]/g, '') || '593982873007',
                pricePerGramUsd:
                  Number.isFinite(parsedGram) && parsedGram > 0 ? parsedGram : 0.1,
                b2bDiscountPercent:
                  Number.isFinite(parsedDiscount) && parsedDiscount > 0 ? parsedDiscount : 40,
                b2bMinKgPerMonth:
                  Number.isFinite(parsedMin) && parsedMin > 0 ? parsedMin : 3,
                googleSheetsCsvUrl: sheetsUrl.trim(),
                whatsappTemplates: {
                  ...inventory.config.whatsappTemplates,
                  blockEs: tplBlockEs,
                  blockEn: tplBlockEn,
                  b2bEs: tplB2bEs,
                  generalEs: tplGeneralEs,
                },
                logistics: {
                  ...inventory.config.logistics,
                  shippingTitleEs,
                  shippingBodyEs,
                  paymentsTitleEs,
                  paymentsSummaryEs,
                  paymentsSummaryEn,
                },
              },
            });
            setSettingsSavedMsg('✓ Variables guardadas y aplicadas en vivo.');
            window.setTimeout(() => setSettingsSavedMsg(''), 4000);
          }}
        >
          <div className="admin-card-head">
            <div>
              <span className="mono admin-step-tag">
                03 // EDITOR DE VARIABLES (WHATSAPP, PAGOS, PRECIOS Y MENSAJES)
              </span>
              <h2 className="admin-card-title">Configuración comercial del sitio</h2>
            </div>
          </div>

          <div className="admin-form-grid">
            <div className="admin-field">
              <label htmlFor="cfg-wa-phone" className="mono admin-label">
                Teléfono WhatsApp Business (sin +)
              </label>
              <input
                id="cfg-wa-phone"
                type="text"
                className="admin-input mono"
                value={whatsappPhone}
                onChange={(e) => setWhatsappPhone(e.target.value)}
                placeholder="593982873007"
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-price-g" className="mono admin-label">
                Tarifa base por defecto ($ USD por gramo — ej: 0.10 = $100/kg)
              </label>
              <input
                id="cfg-price-g"
                type="number"
                step="0.01"
                min="0.01"
                className="admin-input mono"
                value={pricePerGram}
                onChange={(e) => setPricePerGram(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-b2b-discount" className="mono admin-label">
                Descuento B2B (%)
              </label>
              <input
                id="cfg-b2b-discount"
                type="number"
                min="1"
                max="90"
                className="admin-input mono"
                value={b2bDiscount}
                onChange={(e) => setB2bDiscount(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-b2b-min" className="mono admin-label">
                Pedido mínimo B2B (kg / mes)
              </label>
              <input
                id="cfg-b2b-min"
                type="number"
                min="1"
                className="admin-input mono"
                value={b2bMinKg}
                onChange={(e) => setB2bMinKg(e.target.value)}
              />
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="cfg-sheets-url" className="mono admin-label">
                Google Sheets CSV URL (opcional para sincronizar stock externo)
              </label>
              <input
                id="cfg-sheets-url"
                type="url"
                className="admin-input mono"
                value={sheetsUrl}
                onChange={(e) => setSheetsUrl(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/.../pub?output=csv"
              />
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="cfg-tpl-block-es" className="mono admin-label">
                Mensaje WhatsApp al reservar bloque (ES) — Variables: {'{blockId}'}, {'{weight_g}'},{' '}
                {'{price}'}, {'{lotId}'}, {'{lotTitle}'}
              </label>
              <textarea
                id="cfg-tpl-block-es"
                rows={2}
                className="admin-input"
                value={tplBlockEs}
                onChange={(e) => setTplBlockEs(e.target.value)}
              />
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="cfg-tpl-block-en" className="mono admin-label">
                Mensaje WhatsApp al reservar bloque (EN)
              </label>
              <textarea
                id="cfg-tpl-block-en"
                rows={2}
                className="admin-input"
                value={tplBlockEn}
                onChange={(e) => setTplBlockEn(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-tpl-b2b-es" className="mono admin-label">
                Mensaje WhatsApp B2B (ES) — {'{b2bDiscount}'}, {'{b2bMin}'}
              </label>
              <textarea
                id="cfg-tpl-b2b-es"
                rows={2}
                className="admin-input"
                value={tplB2bEs}
                onChange={(e) => setTplB2bEs(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-tpl-gen-es" className="mono admin-label">
                Mensaje WhatsApp general (Header / Footer, ES)
              </label>
              <textarea
                id="cfg-tpl-gen-es"
                rows={2}
                className="admin-input"
                value={tplGeneralEs}
                onChange={(e) => setTplGeneralEs(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-ship-title" className="mono admin-label">
                Título de envío (ES)
              </label>
              <input
                id="cfg-ship-title"
                type="text"
                className="admin-input"
                value={shippingTitleEs}
                onChange={(e) => setShippingTitleEs(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-pay-title" className="mono admin-label">
                Título de pagos (ES)
              </label>
              <input
                id="cfg-pay-title"
                type="text"
                className="admin-input"
                value={paymentsTitleEs}
                onChange={(e) => setPaymentsTitleEs(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-ship-body" className="mono admin-label">
                Condiciones de envío Servientrega (ES)
              </label>
              <textarea
                id="cfg-ship-body"
                rows={2}
                className="admin-input"
                value={shippingBodyEs}
                onChange={(e) => setShippingBodyEs(e.target.value)}
              />
            </div>

            <div className="admin-field">
              <label htmlFor="cfg-pay-summary-es" className="mono admin-label">
                Tipos de pago aceptados (ES)
              </label>
              <textarea
                id="cfg-pay-summary-es"
                rows={2}
                className="admin-input"
                value={paymentsSummaryEs}
                onChange={(e) => setPaymentsSummaryEs(e.target.value)}
              />
            </div>

            <div className="admin-field admin-field-full">
              <label htmlFor="cfg-pay-summary-en" className="mono admin-label">
                Tipos de pago aceptados (EN)
              </label>
              <input
                id="cfg-pay-summary-en"
                type="text"
                className="admin-input"
                value={paymentsSummaryEn}
                onChange={(e) => setPaymentsSummaryEn(e.target.value)}
              />
            </div>
          </div>

          <div className="admin-form-footer">
            <button type="submit" className="btn btn-primary">
              Guardar variables del sitio
            </button>
            {settingsSavedMsg && <span className="admin-feedback mono">{settingsSavedMsg}</span>}
          </div>
        </form>
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
