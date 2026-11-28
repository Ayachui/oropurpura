import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import type { InventoryBlock, InventoryLot } from '../types/inventory';
import { formatBlockPrice, resolveLotPricePerGram } from '../utils/whatsapp';

interface LabelPrintModalProps {
  lot: InventoryLot | null;
  block: InventoryBlock | null;
  pricePerGramUsd: number;
  onClose: () => void;
}

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

export function LabelPrintModal({
  lot,
  block,
  pricePerGramUsd,
  onClose,
}: LabelPrintModalProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const traceUrl = lot && block ? buildTraceUrl(lot.lotId, block.blockId) : '';

  useEffect(() => {
    if (!traceUrl) return;
    let cancelled = false;
    void QRCode.toDataURL(traceUrl, {
      width: 240,
      margin: 1,
      color: {
        dark: '#121016',
        light: '#FAF9FC',
      },
    }).then((url) => {
      if (!cancelled) setQrDataUrl(url);
    });
    return () => {
      cancelled = true;
    };
  }, [traceUrl]);

  if (!lot || !block) return null;

  const lotPricePerGram = resolveLotPricePerGram(lot, { pricePerGramUsd });
  const priceFormatted = formatBlockPrice(block.weight_g, lotPricePerGram);
  const harvestLabel = typeof lot.harvestDate === 'string' ? lot.harvestDate : lot.harvestDate.es;
  const originLabel = lot.incaTrailLot?.community || lot.origin.es;
  const rawBatchCode = lot.incaTrailLot?.sourceBatchId || lot.lotId;

  return (
    <div className="label-modal-backdrop" role="dialog" aria-modal="true" aria-label="Etiqueta 10x10 cm">
      <div className="label-modal-card">
        <div className="label-modal-toolbar no-print">
          <div>
            <div className="mono" style={{ fontSize: '0.72rem', color: 'var(--purple-raw)' }}>
              ETIQUETA VARIABLE 10 × 10 CM (100 × 100 MM)
            </div>
            <h3 style={{ marginTop: '2px' }}>
              {lot.lotId} • {block.blockId} ({block.weight_g} g)
            </h3>
          </div>
          <div className="label-modal-actions">
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => window.print()}
            >
              Imprimir 10×10 cm
            </button>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cerrar ✕
            </button>
          </div>
        </div>

        {/* Printable 10x10 cm Label Sheet */}
        <div className="label-10x10-stage">
          <div id="printable-label-10x10" className="label-10x10">
            <div className="label-top-band">
              <div>
                <div className="label-brand">ORO PÚRPURA</div>
                <div className="label-subbrand mono">ORIGEN 5300 • ZAMORA, ECUADOR</div>
              </div>
              <div className="label-lot-box mono">
                <div>{lot.lotId}</div>
                <div>{block.blockId}</div>
              </div>
            </div>

            <div className="label-mid-grid">
              <div className="label-weight-col">
                <div className="label-field-label mono">PESO NETO REAL</div>
                <div className="label-weight-val">
                  {block.weight_g} <span>g</span>
                </div>
                <div className="label-price-val mono">{priceFormatted} USD</div>
                <div className="label-process-tag mono">
                  0% FERMENTACIÓN • 0% TUESTE
                </div>
              </div>

              <div className="label-qr-col">
                {qrDataUrl ? (
                  <img
                    src={qrDataUrl}
                    alt={`QR Trazabilidad ${lot.lotId} ${block.blockId}`}
                    className="label-qr-img"
                  />
                ) : (
                  <div className="label-qr-placeholder mono">QR...</div>
                )}
                <div className="label-qr-caption mono">ESCANEAR TRAZABILIDAD</div>
              </div>
            </div>

            <div className="label-formula-box">
              <div className="label-field-label mono">INGREDIENTES / FÓRMULA:</div>
              <div className="label-formula-text">{lot.formula.es}</div>
            </div>

            <div className="label-footer-grid mono">
              <div>
                <span className="label-foot-k">ORIGEN:</span> {originLabel}
              </div>
              <div>
                <span className="label-foot-k">LOTE INCA TRAIL:</span> {rawBatchCode} •{' '}
                {harvestLabel}
              </div>
              <div>
                <span className="label-foot-k">USO:</span> Partir trozos (2 cdas. / 20 g en 180 ml agua 72–75 °C)
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
