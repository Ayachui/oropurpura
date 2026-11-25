import { useState } from 'react';
import type { SiteContent } from '../data/content';
import type { InventoryConfig, InventoryLot, Lang } from '../types/inventory';
import { buildBlockWhatsAppMessage, formatBlockPrice } from '../utils/whatsapp';
import { WhatsAppAction } from './WhatsAppAction';

interface LiveLotShowcaseProps {
  lang: Lang;
  t: SiteContent;
  config: InventoryConfig;
  lots: InventoryLot[];
}

function resolveHarvestDate(date: InventoryLot['harvestDate'], lang: Lang): string {
  if (typeof date === 'string') return date;
  return date[lang];
}

export function LiveLotShowcase({ lang, t, config, lots }: LiveLotShowcaseProps) {
  const activeLots = lots.filter((lot) => lot.active);
  const [selectedLotId, setSelectedLotId] = useState<string>(
    () => activeLots[0]?.lotId ?? 'ALL',
  );

  const visibleLots =
    selectedLotId === 'ALL'
      ? activeLots
      : activeLots.filter((lot) => lot.lotId === selectedLotId);

  const totalAvailable = activeLots.reduce(
    (sum, lot) => sum + lot.blocks.filter((b) => b.status === 'disponible').length,
    0,
  );

  return (
    <section id="bloques" className="section">
      <div className="container">
        <div className="showcase-top">
          <div className="section-header" style={{ marginBottom: 0 }}>
            <p className="eyebrow">{t.showcase.eyebrow}</p>
            <h2>{t.showcase.title}</h2>
            <p className="section-subtitle">{t.showcase.subtitle}</p>
          </div>

          {activeLots.length > 1 && (
            <div className="lot-tabs" role="tablist" aria-label="Micro-lotes activos">
              {activeLots.map((lot) => {
                const availCount = lot.blocks.filter((b) => b.status === 'disponible').length;
                const isSelected = selectedLotId === lot.lotId;
                return (
                  <button
                    key={lot.lotId}
                    type="button"
                    role="tab"
                    aria-selected={isSelected}
                    className={`lot-tab-btn ${isSelected ? 'active' : ''}`}
                    onClick={() => setSelectedLotId(lot.lotId)}
                  >
                    <span>{lot.lotId}</span>
                    <span className="lot-tab-count mono">
                      {t.showcase.availableShort(availCount)}
                    </span>
                  </button>
                );
              })}
              <button
                type="button"
                role="tab"
                aria-selected={selectedLotId === 'ALL'}
                className={`lot-tab-btn ${selectedLotId === 'ALL' ? 'active' : ''}`}
                onClick={() => setSelectedLotId('ALL')}
              >
                <span>{t.common.allLotsLabel}</span>
                <span className="lot-tab-count mono">{t.showcase.availableShort(totalAvailable)}</span>
              </button>
            </div>
          )}
        </div>

        {/* Simple 3-step onboarding strip for first-time visitors */}
        <ol className="order-steps-bar" aria-label="Cómo reservar">
          {t.showcase.steps.map((step) => (
            <li key={step} className="order-step-item mono">
              {step}
            </li>
          ))}
        </ol>

        {activeLots.length === 0 ? (
          <div className="empty-lot-card">
            <p>{t.showcase.noLotsFallback}</p>
          </div>
        ) : (
          <div className="lots-stack">
            {visibleLots.map((lot) => {
              const lotTitle = lot.title[lang];
              const availableBlocks = lot.blocks
                .filter((b) => b.status === 'disponible')
                .sort((a, b) => a.weight_g - b.weight_g);
              const soldBlocks = lot.blocks.filter((b) => b.status === 'vendido');
              const orderedBlocks = [...availableBlocks, ...soldBlocks];
              const starterBlockId = availableBlocks[0]?.blockId ?? null;

              return (
                <div key={lot.lotId} className="lot-group">
                  {/* Compact Lot Passport Header */}
                  <header className="lot-passport">
                    <div className="lot-passport-top">
                      <div className="lot-passport-badges">
                        <span className="lot-id-badge">{lot.lotId}</span>
                        <span className="lot-status-pill mono">{t.showcase.lotStatusBadge}</span>
                        <span className="lot-harvest-pill mono">
                          {t.showcase.harvestLabel}: {resolveHarvestDate(lot.harvestDate, lang)}
                        </span>
                      </div>

                      <a
                        href={lot.tznk.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="tznk-verified-badge mono"
                      >
                        <span className="tznk-dot" aria-hidden="true" />
                        <span>{lot.tznk.badge}</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </div>

                    <div className="lot-passport-title-row">
                      <h3 className="lot-title">{lotTitle}</h3>
                      <span className="lot-avail-summary mono">
                        {availableBlocks.length} / {lot.blocks.length}{' '}
                        {availableBlocks.length === 1
                          ? t.ticker.blockSingular
                          : t.ticker.blockPlural}
                      </span>
                    </div>

                    <div className="lot-meta-grid">
                      <div className="lot-meta-cell">
                        <div className="lot-meta-label mono">{t.showcase.originLabel}</div>
                        <div className="lot-meta-value">{lot.origin[lang]}</div>
                      </div>
                      <div className="lot-meta-cell">
                        <div className="lot-meta-label mono">{t.showcase.altitudeLabel}</div>
                        <div className="lot-meta-value mono">{lot.altitude}</div>
                      </div>
                      <div className="lot-meta-cell">
                        <div className="lot-meta-label mono">{t.showcase.tastingLabel}</div>
                        <div className="lot-meta-value">{lot.tastingNotes[lang]}</div>
                      </div>
                    </div>

                    <div className="lot-formula-bar">
                      <span className="lot-formula-label mono">{t.showcase.formulaLabel}:</span>
                      <span className="lot-formula-text">{lot.formula[lang]}</span>
                    </div>

                    <div className="lot-logistics-strip">
                      <span className="lot-logistics-marker mono" aria-hidden="true">
                        $100/KG
                      </span>
                      <p className="lot-logistics-text">{t.showcase.logisticsNotice}</p>
                    </div>
                  </header>

                  {/* Actual-Weight Blocks Grid (Available first, Sold last) */}
                  <div className="blocks-grid">
                    {orderedBlocks.map((block) => {
                      const isAvailable = block.status === 'disponible';
                      const isStarter = isAvailable && block.blockId === starterBlockId;
                      const priceFormatted = formatBlockPrice(
                        block.weight_g,
                        config.pricePerGramUsd,
                      );
                      const cupsEstimate = Math.max(1, Math.round(block.weight_g / 20));
                      const ceremoniesEstimate = Math.max(1, Math.floor(block.weight_g / 40));
                      const waMessage = buildBlockWhatsAppMessage({
                        lang,
                        lotId: lot.lotId,
                        lotTitle,
                        blockId: block.blockId,
                        weight_g: block.weight_g,
                        priceFormatted,
                      });

                      return (
                        <article
                          key={`${lot.lotId}-${block.blockId}`}
                          className={`block-card ${isAvailable ? 'block-available' : 'block-sold'} ${
                            isStarter ? 'block-starter' : ''
                          }`}
                        >
                          <div className="block-card-top">
                            <span className="block-id mono">
                              {t.showcase.blockPrefix} {block.blockId}
                            </span>
                            <div className="block-top-badges">
                              {isStarter && (
                                <span className="starter-pill mono">{t.showcase.starterBadge}</span>
                              )}
                              {isAvailable ? (
                                <span className="block-status-badge status-available mono">
                                  <span className="status-dot-emerald" aria-hidden="true" />
                                  {t.showcase.statusAvailable}
                                </span>
                              ) : (
                                <span className="block-status-badge status-sold mono">
                                  {t.showcase.statusSold}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="block-weight-center">
                            <div className="block-weight-figure">
                              <span>{block.weight_g}</span>
                              <span className="block-weight-unit">g</span>
                            </div>
                            <div className="block-servings">
                              {t.showcase.servingsFormat(cupsEstimate, ceremoniesEstimate)}
                            </div>
                          </div>

                          <div className="block-price-box">
                            <div
                              className={`block-price mono ${isAvailable ? '' : 'block-price-struck'}`}
                            >
                              {priceFormatted} <span className="block-currency">USD</span>
                            </div>
                            <div className="block-shipping-note mono">
                              {isAvailable ? t.showcase.plusShipping : lot.lotId}
                            </div>
                          </div>

                          <div className="block-card-footer">
                            {isAvailable ? (
                              <WhatsAppAction
                                phone={config.whatsappPhone}
                                label={t.showcase.reserveCta}
                                message={waMessage}
                                copyLabel={t.common.copyText}
                                copiedLabel={t.common.copied}
                                variant="primary"
                                fullWidth
                                compactCopy
                              />
                            ) : (
                              <button
                                type="button"
                                className="btn btn-sold-disabled"
                                disabled
                              >
                                {t.showcase.soldButtonLabel}
                              </button>
                            )}
                          </div>
                        </article>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
