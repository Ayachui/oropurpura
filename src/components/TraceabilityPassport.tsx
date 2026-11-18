import { useState } from 'react';
import type { Lang } from '../data/content';
import type { OroProductionBatch, OroSkuPublicAvailability } from '../types/liveInventory';

type Props = {
  lang: Lang;
  availability?: OroSkuPublicAvailability;
  initialBatchCode?: string | null;
};

export function TraceabilityPassport({ lang, availability, initialBatchCode }: Props) {
  const batches = availability?.activeBatches?.length
    ? availability.activeBatches
    : availability?.primaryBatch
      ? [availability.primaryBatch]
      : [];

  const [selectedCode, setSelectedCode] = useState<string>('');

  const resolvedCode =
    selectedCode && batches.some((b) => b.batchCode === selectedCode)
      ? selectedCode
      : initialBatchCode && batches.some((b) => b.batchCode === initialBatchCode)
        ? initialBatchCode
        : batches[0]?.batchCode || '';

  const activeBatch: OroProductionBatch | null =
    batches.find((b) => b.batchCode === resolvedCode) ?? availability?.primaryBatch ?? null;

  const isEs = lang === 'es';
  const labels = isEs
    ? {
        title: 'FINCA → INCA TRAIL → ORO PÚRPURA',
        activeBatches: 'Lotes activos disponibles:',
        stage1: '01 // ORIGEN FINCA SHUAR (ZAMORA)',
        stage2: '02 // LOTE MATERIA PRIMA & BASE L2',
        stage3: '03 // PRODUCCIÓN ORO PÚRPURA',
        farmer: 'Agricultor',
        community: 'Comunidad / Región',
        harvest: 'Cosecha',
        rawLot: 'Lote origen',
        drying: 'Secado FMAD / VMC',
        nft: 'Verificación Base L2',
        batch: 'Partida producción',
        dates: 'Elaboración / Vencimiento',
        standards: 'Estándares',
        verifyRaw: 'Ver expediente completo del lote ↗',
        verifyNft: 'Ver NFT en Basescan ↗',
        pendingTitle: 'Sin lote molido en stock inmediato (Disponible bajo pre-orden)',
        pendingBody:
          'Este SKU se formula por micro-lotes desde cacao Nacional con NFT verificado en Base L2. Puedes reservar en preventa por WhatsApp o revisar los lotes de materia prima disponibles en bodega:',
        browseReserve: 'Ver lotes verificados en incatrailfoods.com ↗',
        depletedTag: 'Agotado (0 kg)',
      }
    : {
        title: 'FARM → INCA TRAIL → ORO PÚRPURA',
        activeBatches: 'Active batches in stock:',
        stage1: '01 // SHUAR FARM ORIGIN (ZAMORA)',
        stage2: '02 // RAW CACAO LOT & BASE L2',
        stage3: '03 // ORO PÚRPURA PRODUCTION',
        farmer: 'Farmer',
        community: 'Community / Region',
        harvest: 'Harvest Date',
        rawLot: 'Source Cacao Lot',
        drying: 'FMAD / VMC Drying',
        nft: 'Base L2 Proof',
        batch: 'Production Batch',
        dates: 'Produced / Best Before',
        standards: 'Quality Standards',
        verifyRaw: 'Open full raw lot trace ↗',
        verifyNft: 'View NFT on Basescan ↗',
        pendingTitle: 'Currently awaiting next micro-batch (Available for pre-order)',
        pendingBody:
          'Crafted on demand from Base L2 NFT-verified Nacional cacao lots. Reserve via WhatsApp pre-order or inspect live raw cacao lots in our reserve:',
        browseReserve: 'Browse verified raw cacao lots at incatrailfoods.com ↗',
        depletedTag: 'Sold out (0 kg)',
      };

  if (!activeBatch) {
    return (
      <div className="trace-passport-box">
        <div className="trace-passport-head">
          <span className="mono">{labels.title}</span>
        </div>
        <p style={{ margin: '10px 0 12px', fontSize: '0.92rem', color: 'var(--ink-primary)' }}>
          <strong>{labels.pendingTitle}:</strong> {labels.pendingBody}
        </p>
        <a
          href="https://incatrailfoods.com/products"
          target="_blank"
          rel="noopener noreferrer"
          className="tznk-link"
          style={{ marginTop: 0 }}
        >
          {labels.browseReserve}
        </a>
      </div>
    );
  }

  const primaryRaw = activeBatch.consumedLots[0];
  const standards = isEs ? activeBatch.recipe.standardsEs : activeBatch.recipe.standardsEn;

  return (
    <div className="trace-passport-box">
      <div className="trace-passport-head">
        <span className="mono">{labels.title}</span>
        <span className="trace-batch-pill mono">
          {activeBatch.batchCode} •{' '}
          {activeBatch.remainingKg > 0 ? `${activeBatch.remainingKg} kg` : labels.depletedTag}
        </span>
      </div>

      {batches.length > 1 ? (
        <div className="trace-batch-switcher">
          <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--ink-muted)' }}>
            {labels.activeBatches}
          </span>
          {batches.map((b) => (
            <button
              key={b.batchCode}
              type="button"
              onClick={() => setSelectedCode(b.batchCode)}
              className={`trace-pill-btn ${b.batchCode === activeBatch.batchCode ? 'active' : ''}`}
            >
              {b.batchCode} ({b.remainingKg} kg)
            </button>
          ))}
        </div>
      ) : null}

      <div className="trace-passport-grid">
        <div className="trace-stage">
          <div className="trace-stage-label mono">{labels.stage1}</div>
          {primaryRaw ? (
            <dl className="trace-dl">
              <div>
                <dt>{labels.farmer}</dt>
                <dd>{primaryRaw.farmerName}</dd>
              </div>
              <div>
                <dt>{labels.community}</dt>
                <dd>
                  {primaryRaw.community} ({primaryRaw.region})
                </dd>
              </div>
              <div>
                <dt>{labels.harvest}</dt>
                <dd className="mono">{primaryRaw.harvestDate}</dd>
              </div>
            </dl>
          ) : null}
        </div>

        <div className="trace-stage">
          <div className="trace-stage-label mono">{labels.stage2}</div>
          {primaryRaw ? (
            <dl className="trace-dl">
              <div>
                <dt>{labels.rawLot}</dt>
                <dd className="mono">
                  {activeBatch.consumedLots.map((c) => `${c.sourceBatchId} (${c.usedKg} kg)`).join(', ')}
                </dd>
              </div>
              <div>
                <dt>{labels.drying}</dt>
                <dd>{primaryRaw.dryingMethod}</dd>
              </div>
              <div>
                <dt>{labels.nft}</dt>
                <dd className="mono">NFT #{primaryRaw.nftTokenId || 'Base L2'}</dd>
              </div>
            </dl>
          ) : null}
          {primaryRaw ? (
            <div className="trace-links-row">
              <a href={primaryRaw.traceUrl} target="_blank" rel="noopener noreferrer">
                {labels.verifyRaw}
              </a>
              {primaryRaw.basescanNftUrl ? (
                <a href={primaryRaw.basescanNftUrl} target="_blank" rel="noopener noreferrer">
                  {labels.verifyNft}
                </a>
              ) : null}
            </div>
          ) : null}
        </div>

        <div className="trace-stage">
          <div className="trace-stage-label mono">{labels.stage3}</div>
          <dl className="trace-dl">
            <div>
              <dt>{labels.batch}</dt>
              <dd className="mono">
                {activeBatch.batchCode} ({activeBatch.producedKg} kg)
              </dd>
            </div>
            <div>
              <dt>{labels.dates}</dt>
              <dd className="mono">
                {activeBatch.productionDate} → {activeBatch.bestBeforeDate}
              </dd>
            </div>
            <div>
              <dt>{labels.standards}</dt>
              <dd>{standards.join(' • ')}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
