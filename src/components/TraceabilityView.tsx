import type { InventoryLot } from '../types/inventory';
import { formatBlockPrice } from '../utils/whatsapp';

interface TraceabilityViewProps {
  lots: InventoryLot[];
  pricePerGramUsd: number;
  lotParam: string | null;
  blockParam: string | null;
  onBackToShop: () => void;
}

export function TraceabilityView({
  lots,
  pricePerGramUsd,
  lotParam,
  blockParam,
  onBackToShop,
}: TraceabilityViewProps) {
  const matchedLot =
    (lotParam
      ? lots.find((l) => l.lotId.toUpperCase() === lotParam.toUpperCase())
      : undefined) ?? lots[0];

  const matchedBlock =
    matchedLot && blockParam
      ? matchedLot.blocks.find((b) => b.blockId.toUpperCase() === blockParam.toUpperCase())
      : undefined;

  if (!matchedLot) {
    return (
      <section className="section">
        <div className="container">
          <button type="button" className="btn-back-home mono" onClick={onBackToShop}>
            ← Ir a la vitrina de bloques
          </button>
          <div className="empty-lot-card" style={{ marginTop: '20px' }}>
            <p>Lote no encontrado.</p>
          </div>
        </div>
      </section>
    );
  }

  const harvestDate =
    typeof matchedLot.harvestDate === 'string'
      ? matchedLot.harvestDate
      : matchedLot.harvestDate.es;
  const inca = matchedLot.incaTrailLot;
  const incaTraceUrl = inca?.traceUrl || 'https://www.incatrailfoods.com/products';

  return (
    <section className="section trace-page">
      <div className="container">
        <div className="storefront-page-bar">
          <button type="button" className="btn-back-home mono" onClick={onBackToShop}>
            ← Ir a la vitrina de bloques
          </button>
          <span className="storefront-live-pill mono">
            <span className="status-dot-emerald" aria-hidden="true" />
            PASAPORTE DE TRAZABILIDAD • TZNK / INCA TRAIL
          </span>
        </div>

        <div className="trace-summary-card">
          <div className="trace-header-row">
            <div>
              <p className="eyebrow">RESUMEN DE TRAZABILIDAD DEL BLOQUE</p>
              <h1>{matchedLot.title.es}</h1>
            </div>
            <div className="trace-id-pill mono">
              {matchedLot.lotId}
              {matchedBlock ? ` • ${matchedBlock.blockId}` : ''}
            </div>
          </div>

          {matchedBlock && (
            <div className="trace-block-highlight">
              <div>
                <div className="mono trace-k">PESO NETO REAL</div>
                <div className="trace-v-big">{matchedBlock.weight_g} g</div>
              </div>
              <div>
                <div className="mono trace-k">VALOR DEL BLOQUE</div>
                <div className="trace-v-big mono">
                  {formatBlockPrice(matchedBlock.weight_g, pricePerGramUsd)} USD
                </div>
              </div>
              <div>
                <div className="mono trace-k">ESTADO</div>
                <div className="trace-v-status mono">
                  {matchedBlock.status === 'disponible' ? 'DISPONIBLE' : 'RESERVADO / VENDIDO'}
                </div>
              </div>
            </div>
          )}

          <div className="trace-steps-grid">
            <article className="trace-step-card">
              <div className="mono trace-step-num">01 // ORIGEN FINCA SHUAR (ZAMORA)</div>
              <dl className="trace-dl">
                <div>
                  <dt>Comunidad / Origen</dt>
                  <dd>{inca?.community || matchedLot.origin.es}</dd>
                </div>
                {inca?.farmerName && (
                  <div>
                    <dt>Productor</dt>
                    <dd>{inca.farmerName}</dd>
                  </div>
                )}
                <div>
                  <dt>Altitud / Cosecha</dt>
                  <dd>
                    {matchedLot.altitude} • {inca?.harvestDate || harvestDate}
                  </dd>
                </div>
              </dl>
            </article>

            <article className="trace-step-card">
              <div className="mono trace-step-num">02 // PROCESO VIVO & LOTE INCA TRAIL</div>
              <dl className="trace-dl">
                <div>
                  <dt>Lote Materia Prima (Inca Trail)</dt>
                  <dd className="mono">{inca?.sourceBatchId || matchedLot.lotId}</dd>
                </div>
                <div>
                  <dt>Estabilización</dt>
                  <dd>
                    0 días fermentación • Vacío ≤ {inca?.secondaryDryingTempC ?? 75} °C
                    {inca?.finalMoisturePercent ? ` • ${inca.finalMoisturePercent}% humedad` : ''}
                  </dd>
                </div>
                {inca?.nftTokenId && (
                  <div>
                    <dt>Registro Base L2</dt>
                    <dd className="mono">NFT #{inca.nftTokenId}</dd>
                  </div>
                )}
              </dl>
            </article>

            <article className="trace-step-card">
              <div className="mono trace-step-num">03 // FÓRMULA ORO PÚRPURA</div>
              <p className="trace-formula-p">{matchedLot.formula.es}</p>
              <p className="trace-notes-p">
                <strong>Notas:</strong> {matchedLot.tastingNotes.es}
              </p>
            </article>
          </div>

          <div className="trace-cta-bar">
            <a
              href={incaTraceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              Ver trazabilidad detallada en Inca Trail Foods ↗
            </a>
            {inca?.basescanNftUrl && (
              <a
                href={inca.basescanNftUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-secondary"
              >
                Verificar en BaseScan ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
